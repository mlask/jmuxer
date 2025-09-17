import * as debug from './util/debug';
import { appendByteArray } from './util/utils.js';
import { H264NalUnit } from './parsers/h264.js';
import { H265NalUnit } from './parsers/h265.js';
import { AACParser } from './parsers/aac.js';
import Event from './util/event';
import RemuxController from './controller/remux.js';
import BufferController from './controller/buffer.js';
import { Duplex } from 'stream';
import { Stream } from './util/stream.js';

export default class JMuxer extends Event {
    constructor (options) {
        super('jmuxer');
        
        const defaults = {
            fps: 30,
            live: false,
            mode: 'both', // both, audio, video
            node: '',
            debug: false,
            maxDelay: 1500,
            timescale: 1000,
            clearBuffer: true,
            estimateFps: false,
            autoCancelDelay: true,
            readFpsFromTrack: false, // set true to fetch fps value from NALu
            onData: function () {}, // function called when data is ready to be sent
            onReady: function () {}, // function called when MSE is ready to accept frames
            onError: function () {}, // function called when jmuxer encounters any buffer related errors
            onUnsupportedCodec: function () {}, //function called when jmuxer encounters unsupported video codec
            onMissingVideoFrames: function () {}, // function called when jmuxer encounters any missing video frames
            onMissingAudioFrames: function () {}, // function called when jmuxer encounters any missing audio frames
        };
        
        this.env = typeof process === 'object' && typeof window === 'undefined' ? 'node' : 'browser';
        this.hevc = undefined;
        this.isReset = false;
        this.options = Object.assign({}, defaults, options);
        
        if (this.options.debug) {
            debug.setLogger();
        }
        
        if (!this.options.fps) {
            this.options.fps = 30;
        }
        
        this.fpsUpdated = false;
        this.frameDuration = (this.options.timescale / this.options.fps) | 0;
        this.remuxController = new RemuxController(this.env, this.options.live, this.options.estimateFps);
        this.remuxController.addTrack(this.options.mode);
        
        this.initData();
        
        this.remuxController.on('buffer', this.#onBuffer.bind(this));
        if (this.env === 'browser') {
            this.remuxController.on('ready', this.createBuffer.bind(this));
            this.initBrowser();
        }
    }
    
    feed (data) {
        let left;
        let remux = false;
        let chunks = {
            video: [],
            audio: []
        };
        let slices;
        let duration;
        
        if (!data || !this.remuxController)
            return;
        
        duration = data.duration ? parseInt(data.duration) : 0;
        
        if (data.video) {
            data.video = appendByteArray(this.remainingData, data.video);
            [slices, left] = Stream.extractNalUnits(data.video);
            this.remainingData = left || new Uint8Array();
            
            if (slices.length > 0) {
                chunks.video = this.getVideoFrames(slices, duration);
                remux = true;
            }
            else {
                debug.error('Failed to extract any NAL units from video data:', left);
                if (typeof this.options.onMissingVideoFrames === 'function')
                    this.options.onMissingVideoFrames.call(null, data);
                return;
            }
        }
        
        if (data.audio) {
            slices = AACParser.extractAAC(data.audio);
            
            if (slices.length > 0) {
                chunks.audio = this.getAudioFrames(slices, duration);
                remux = true;
            }
            else {
                debug.error('Failed to extract audio data from:', data.audio);
                if (typeof this.options.onMissingAudioFrames === 'function')
                    this.options.onMissingAudioFrames.call(null, data);
                return;
            }
        }
        
        if (!remux) {
            debug.log('Input object must have video and/or audio property. Make sure it is a valid typed array');
            return;
        }
        
        this.remuxController.remux(chunks);
    }
    
    reset () {
        this.isReset = true;
        this.node.pause();
        
        if (this.remuxController)
            this.remuxController.reset();
        
        if (this.bufferControllers) {
            for (let type in this.bufferControllers)
                this.bufferControllers[type].destroy();
            
            this.bufferControllers = null;
            this.endMSE();
        }
        
        this.initData();
        
        if (this.env === 'browser')
            this.initBrowser();
        
        debug.log('JMuxer was reset');
    }
    
    endMSE () {
        if (!this.mseEnded) {
            try {
                this.mseEnded = true;
                this.mediaSource.endOfStream();
            }
            catch (e) {
                debug.error('mediasource is not available to end');
            }
        }
    }
    
    destroy () {
        if (this.stream) {
            this.remuxController.flush();
            this.stream.push(null);
            this.stream = null;
        }
        
        if (this.remuxController) {
            this.remuxController.destroy();
            this.remuxController = null;
        }
        
        if (this.bufferControllers) {
            for (let type in this.bufferControllers) {
                this.bufferControllers[type].destroy();
            }
            this.bufferControllers = null;
            this.endMSE();
        }
        
        this.node = false;
        this.mseReady = false;
        this.mediaSource = null;
        this.videoStarted = false;
    }
    
    initData () {
        this.kfCounter = 0;
        this.kfPosition = [];
        this.pendingUnits = {};
        this.remainingData = new Uint8Array();
        this.lastCleaningTime = performance.now();
    }
    
    setupMSE () {
        window.MediaSource = window.MediaSource || window.WebKitMediaSource || window.ManagedMediaSource;
        if (!window.MediaSource) {
            throw 'Oops! Browser does not support Media Source Extension or Managed Media Source (iOS 17+).';
        }
        
        this.isMSESupported = !!window.MediaSource;
        this.mediaSource = new window.MediaSource();
        this.url = URL.createObjectURL(this.mediaSource);
        
        if (window.MediaSource === window.ManagedMediaSource) {
            try {
                this.node.removeAttribute('src');
                this.node.disableRemotePlayback = true; // ManagedMediaSource will not open without disableRemotePlayback set to false or source alternatives
                
                const source = document.createElement('source');
                source.type = 'video/mp4';
                source.src = this.url;
                
                this.node.appendChild(source);
                this.node.load();
            }
            catch (error) {
                this.node.src = this.url;
            }
        }
        else {
            this.node.src = this.url;
        }
        
        this.mseEnded = false;
        this.mediaSource.addEventListener('sourceopen', this.#onMSEOpen.bind(this));
        this.mediaSource.addEventListener('sourceclose', this.#onMSEClose.bind(this));
        this.mediaSource.addEventListener('webkitsourceopen', this.#onMSEOpen.bind(this));
        this.mediaSource.addEventListener('webkitsourceclose', this.#onMSEClose.bind(this));
    }
    
    cancelDelay () {
        if (this.node.buffered && this.node.buffered.length > 0 && !this.node.seeking && !document.hidden) {
            const end = this.node.buffered.end(0);
            if ((end - this.node.currentTime) > (this.options.maxDelay / 1000)) {
                this.node.currentTime = end - (this.options.maxDelay / 2000); // 0.001;
                this.node.play().catch(error => {
                    debug.log('cancelDelay play() error', error);
                });
            }
        }
    }
    
    clearBuffer () {
        if (this.options.clearBuffer && (performance.now() - this.lastCleaningTime) >= 10000) {
            for (let type in this.bufferControllers) {
                let cleanMaxLimit = this.getSafeClearOffsetOfBuffer(this.node.currentTime);
                this.bufferControllers[type].initCleanup(cleanMaxLimit);
            }
            this.lastCleaningTime = performance.now();
        }
    }
    
    initBrowser () {
        if (typeof this.options.node === 'string' && this.options.node == '') {
            debug.error('no video element were found to render, provide a valid video element');
        }
        
        this.node = typeof this.options.node === 'string' ? document.getElementById(this.options.node) : this.options.node;
        this.mseReady = false;
        this.setupMSE();
    }
    
    createBuffer () {
        if (!this.mseReady || !this.remuxController || !this.remuxController.isReady() || this.bufferControllers)
            return;
        
        this.bufferControllers = {};
        for (let type in this.remuxController.tracks) {
            let track = this.remuxController.tracks[type];
            if (!JMuxer.isSupported(`${type}/mp4; codecs="${track.mp4track.codec}"`)) {
                debug.error('Browser does not support codec');
                if (typeof this.options.onUnsupportedCodec === 'function') {
                    this.options.onUnsupportedCodec.call(this, {
                        track: track,
                        codec_string: track.mp4track.codec,
                        full_codec_string: `${type}/mp4; codecs="${track.mp4track.codec}"`,
                    });
                }
                return false;
            }
            let sb = this.mediaSource.addSourceBuffer(`${type}/mp4; codecs="${track.mp4track.codec}"`);
            this.bufferControllers[type] = new BufferController(sb, type);
            this.bufferControllers[type].on('error', this.#onBufferError.bind(this));
        }
    }
    
    createStream () {
        let feed = this.feed.bind(this);
        let destroy = this.destroy.bind(this);
        
        this.stream = new Duplex({
            writableObjectMode: true,
            read (size) {},
            write (data, encoding, callback) {
                feed(data);
                callback();
            },
            final (callback) {
                destroy();
                callback();
            },
        });
        
        return this.stream;
    }
    
    releaseBuffer () {
        for (let type in this.bufferControllers) {
            this.bufferControllers[type].doAppend();
        }
    }
    
    getAudioFrames (aacFrames, duration) {
        let frames = [],
            fd = 0,
            tt = 0;
        
        for (let units of aacFrames) {
            frames.push({ units });
        }
        fd = duration ? duration / frames.length | 0 : this.frameDuration;
        tt = duration ? (duration - (fd * frames.length)) : 0;
        frames.map((frame) => {
            frame.duration = fd;
            if (tt > 0) {
                frame.duration++;
                tt--;
            }
        });
        return frames;
    }
    
    getVideoFrames (nalus, duration) {
        let fd = 0;
        let tt = 0;
        let vcl = false;
        let units = [];
        let frames = [];
        let keyFrame = false;
        
        if (this.pendingUnits.units) {
            vcl = this.pendingUnits.vcl;
            units = this.pendingUnits.units;
            keyFrame = this.pendingUnits.keyFrame;
            
            this.pendingUnits = {};
        }
        
        for (const nalu of nalus) {
            if (typeof this.hevc === 'undefined')
                this.hevc = Stream.NalUnitIsH265(nalu);
            
            const unit = this.hevc ? new H265NalUnit(nalu) : new H264NalUnit(nalu);
            if (units.length && vcl && (unit.isfmb || !unit.isvcl)) {
                frames.push({
                    units,
                    keyFrame,
                });
                
                vcl = false;
                units = [];
                keyFrame = false;
            }
            
            units.push(unit);
            
            vcl = vcl || unit.isvcl;
            keyFrame = keyFrame || unit.isKeyframe();
        }
        
        if (units.length) {
            // lets keep indecisive nalus as pending in case of fixed fps
            if (!duration) {
                this.pendingUnits = {
                    units,
                    keyFrame,
                    vcl,
                };
            }
            else if (vcl) {
                frames.push({
                    units,
                    keyFrame,
                });
            }
            else {
                const last = frames.length - 1;
                if (last >= 0)
                    frames[last].units = frames[last].units.concat(units);
            }
        }
        
        fd = duration ? duration / frames.length | 0 : this.frameDuration;
        tt = duration ? (duration - (fd * frames.length)) : 0;
        
        frames.map((frame) => {
            frame.duration = fd;
            
            if (tt > 0) {
                frame.duration ++;
                tt --;
            }
            
            this.kfCounter ++;
            
            if (frame.keyFrame && this.options.clearBuffer) {
                this.kfPosition.push((this.kfCounter * fd) / 1000);
            }
        });
        
        debug.log(`jmuxer: No. of frames of the last chunk: ${frames.length}`);
        return frames;
    }
    
    applyAndClearBuffer () {
        if (this.bufferControllers) {
            this.releaseBuffer();
            this.clearBuffer();
        }
    }
    
    getSafeClearOffsetOfBuffer (offset) {
        let maxLimit = (this.options.mode === 'audio' && offset) || 0,
            adjacentOffset;
        for (let i = 0; i < this.kfPosition.length; i++) {
            if (this.kfPosition[i] >= offset) {
                break;
            }
            adjacentOffset = this.kfPosition[i];
        }
        if (adjacentOffset) {
            this.kfPosition = this.kfPosition.filter(kfDelimiter => {
                if (kfDelimiter < adjacentOffset) {
                    maxLimit = kfDelimiter;
                }
                return kfDelimiter >= adjacentOffset;
            });
        }
        return maxLimit;
    }
    
    #onBuffer (data) {
        if (this.options.readFpsFromTrack && typeof data.fps !== 'undefined' && this.options.fps != data.fps) {
            this.fpsUpdated = true;
            this.options.fps = data.fps;
            this.frameDuration = (1000 / data.fps);
            
            debug.log(`JMuxer changed FPS to ${data.fps} from track data`);
        }
        
        if (this.env === 'browser') {
            if (this.bufferControllers && this.bufferControllers[data.type]) {
                this.bufferControllers[data.type].feed(data.payload).then(() => {
                    this.applyAndClearBuffer();
                    if (this.options.autoCancelDelay)
                        this.cancelDelay();
                });
            }
        }
        else if (this.stream) {
            this.stream.push(data.payload);
        }
        
        if (this.options.onData) {
            this.options.onData(data.payload);
        }
    }
    
    #onMSEOpen () {
        this.mseReady = true;
        URL.revokeObjectURL(this.url);
        
        if (typeof this.options.onReady === 'function')
            this.options.onReady.call(null, this.isReset, this.mediaSource);
        
        if (this.options.live || this.remuxController?.duration === -1) {
            if (!!this.mediaSource.setLiveSeekableRange && !!this.mediaSource.clearLiveSeekableRange) {
                this.mediaSource.duration = Infinity;
            }
            else {
                this.mediaSource.duration = Math.pow(2, 32);
            }
        }
    }
    
    #onMSEClose () {
        this.mseReady = false;
        this.videoStarted = false;
    }
    
    #onBufferError (data) {
        if (data.name == 'QuotaExceeded') {
            debug.log(`JMuxer cleaning ${data.type} buffer due to QuotaExceeded error`);
            this.bufferControllers[data.type].initCleanup(this.node.currentTime);
            return;
        }
        else if (data.name == 'InvalidStateError') {
            debug.log('JMuxer is reseting due to InvalidStateError');
            this.reset();
        }
        else {
            this.endMSE();
        }
        
        if (typeof this.options.onError === 'function') {
            this.options.onError.call(null, data);
        }
    }
    
    static isSupported (codec) {
        return (window.MediaSource && window.MediaSource.isTypeSupported(codec));
    }
}

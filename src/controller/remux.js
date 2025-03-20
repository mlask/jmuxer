import * as debug from '../util/debug';
import { MP4 } from '../util/mp4-generator.js';
import { AACRemuxer } from '../remuxer/aac.js';
import { VideoRemuxer } from '../remuxer/video.js';
import { appendByteArray, secToTime } from '../util/utils.js';
import Event from '../util/event';

export default class RemuxController extends Event {
    constructor (env, live = false, estimate_fps = false) {
        super('remuxer');
        
        this.env = env;
        this.seq = 1;
        this.live = live;
        this.tracks = {};
        this.duration = live ? -1 : 0;
        this.aacParser = null;
        this.timescale = 1000;
        this.trackTypes = [];
        this.initialized = false;
        this.estimate_fps = estimate_fps;
    }
    
    addTrack (type) {
        if (type === 'video' || type === 'both') {
            this.tracks.video = new VideoRemuxer(this.timescale, this.duration);
            this.trackTypes.push('video');
        }
        
        if (type === 'audio' || type === 'both') {
            const aacRemuxer = new AACRemuxer(this.timescale, this.duration);
            
            this.aacParser = aacRemuxer.getAacParser();
            this.tracks.audio = aacRemuxer;
            this.trackTypes.push('audio');
        }
    }
    
    reset () {
        for (let type of this.trackTypes) {
            this.tracks[type].resetTrack();
        }
        
        this.initialized = false;
    }
    
    destroy () {
        this.tracks = {};
        this.offAll();
    }
    
    flush () {
        if (!this.initialized) {
            if (this.isReady()) {
                this.dispatch('ready');
                this.initSegment();
                this.initialized = true;
                
                this.flush();
            }
        }
        else {
            for (let type of this.trackTypes) {
                let track = this.tracks[type];
                let pay = track.getPayload();
                
                if (pay && pay.byteLength) {
                    const moof = MP4.moof(this.seq, track.dts, track.mp4track);
                    const mdat = MP4.mdat(pay);
                    const data = {
                        dts: track.dts,
                        type: type,
                        payload: appendByteArray(moof, mdat),
                    };
                    
                    if (type === 'video') {
                        data.fps = track.mp4track.fps;
                        data.duration = this.duration;
                        data.timescale = this.timescale;
                    }
                    
                    this.dispatch('buffer', data);
                    this.#estimateFPS();
                    
                    let duration = secToTime(track.dts / this.timescale);
                    debug.log(`put segment (${type}): dts: ${track.dts} frames: ${track.mp4track.samples.length} second: ${duration}`);
                    
                    track.flush();
                    
                    this.seq ++;
                }
                else {
                    // empty `moof` for continuity
                    const moof = MP4.moof(this.seq, track.dts, track.mp4track);
                    const data = {
                        dts: track.dts,
                        type: type,
                        payload: moof,
                    };
                    
                    if (type === 'video') {
                        data.fps = track.mp4track.fps;
                        data.duration = this.duration;
                        data.timescale = this.timescale;
                    }
                    
                    this.dispatch('buffer', data);
                }
            }
        }
    }
    
    initSegment () {
        let tracks = [];
        
        for (let type of this.trackTypes) {
            let track = this.tracks[type];
            if (this.env == 'browser') {
                let data = {
                    type: type,
                    payload: MP4.initSegment([track.mp4track]),
                };
                
                this.dispatch('buffer', data);
            }
            else {
                tracks.push(track.mp4track);
            }
        }
        
        if (this.env == 'node') {
            let data = {
                type: 'all',
                payload: MP4.initSegment(tracks),
            };
            
            this.dispatch('buffer', data);
        }
        
        debug.log('Initial segment generated.');
    }
    
    isReady () {
        for (let type of this.trackTypes) {
            if (!this.tracks[type].readyToDecode || !this.tracks[type].samples.length) return false;
        }
        
        return true;
    }
    
    remux (data) {
        for (let type of this.trackTypes) {
            let frames = data[type];
            
            if (type === 'audio' && this.tracks.video && !this.tracks.video.readyToDecode)
                continue; /* if video is present, don't add audio until video get ready */
            
            if (frames.length > 0)
                this.tracks[type].remux(frames);
        }
        
        this.flush();
    }
    
    #estimateFPS () {
        if (!this.estimate_fps)
            return;
        
        if (typeof this._estimate_fps === 'undefined') {
            this._estimate_fps = {
                fps: 0,
                perf: performance.now(),
                frames: 0,
            };
        }
        
        this._estimate_fps.frames ++;
        
        if (this._estimate_fps.frames > 1)
            this._estimate_fps.fps = Math.round(this._estimate_fps.frames / ((performance.now() - this._estimate_fps.perf) / 1000), 2);
        
        if (this._estimate_fps.frames > 10 && this._estimate_fps.fps > 0 && this._estimate_fps.fps !== this.tracks.video.fps)
        {
            debug.log(`remux: set estimated fps=${this._estimate_fps.fps} (video.fps=${this.tracks.video.fps})`);
            this.tracks.video.fps = this._estimate_fps.fps;
        }
    }
}

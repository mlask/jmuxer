import * as debug from '../util/debug';
import { BaseRemuxer } from './base.js';

export class VideoRemuxer extends BaseRemuxer {
    constructor (timescale, duration) {
        super();
        
        this.dts = 0;
        this.parser = null;
        this.nextDts = 0;
        this.samples = [];
        this.mp4track = {
            id: BaseRemuxer.getTrackID(),
            fps: 30,
            len: 0,
            pps: undefined,
            sps: undefined,
            vps: undefined,
            type: 'video',
            width: 0,
            height: 0,
            params: {},
            samples: [],
            duration: duration,
            timescale: timescale || 1000,
            fragmented: true,
            pixelRatio: [1, 1],
        };
        this.readyToDecode = false;
    }
    
    resetTrack () {
        this.dts = 0;
        this.nextDts = 0;
        this.mp4track.pps = '';
        this.mp4track.sps = '';
        this.mp4track.vps = '';
        this.readyToDecode = false;
    }
    
    remux (frames) {
        for (let frame of frames) {
            let size = 0;
            let units = [];
            
            for (let unit of frame.units) {
                if (this.parser === null)
                    this.parser = unit.initParser(this);
                
                if (this.parser.parseNAL(unit)) {
                    units.push(unit);
                    size += unit.getSize();
                }
                else
                    debug.log('parseNAL failed!');
            }
            
            if (units.length > 0 && this.readyToDecode) {
                this.mp4track.len += size;
                
                this.samples.push({
                    size: size,
                    units: units,
                    duration: frame.duration,
                    keyFrame: frame.keyFrame,
                });
            }
        }
    }
    
    getPayload () {
        if (!this.isReady())
            return null;
        
        let offset = 0;
        let payload = new Uint8Array(this.mp4track.len);
        let samples = this.mp4track.samples;
        
        this.dts = this.nextDts;
        
        while (this.samples.length) {
            const sample = this.samples.shift();
            
            if (sample.duration <= 0) {
                debug.log(`remuxer: invalid sample duration at DTS: ${this.nextDts} :${sample.duration}`);
                this.mp4track.len -= sample.size;
                continue;
            }
            
            this.nextDts += sample.duration;
            
            for (const unit of sample.units) {
                payload.set(unit.getData(), offset);
                offset += unit.getSize();
            }
            
            samples.push({
                cts: 0,
                size: sample.size,
                flags: {
                    dependsOn: sample.keyFrame ? 2 : 1,
                    isLeading: 0,
                    isNonSync: sample.keyFrame ? 0 : 1,
                    degradPrio: 0,
                    isDependedOn: 0,
                    hasRedundancy: 0,
                },
                duration: sample.duration,
            });
        }
        
        if (!samples.length)
            return null;
        
        return new Uint8Array(payload.buffer, 0, this.mp4track.len);
    }
}

import * as debug from '../util/debug';
import Event from '../util/event';
import { appendByteArray } from '../util/utils.js';

export default class BufferController extends Event {
    constructor (sourceBuffer, type) {
        super('buffer');
        
        this.type = type;
        this.queue = new Uint8Array();
        
        this.cleaning = false;
        this.cleanOffset = 30;
        this.cleanRanges = [];
        this.pendingCleaning = 0;
        
        this.sourceBuffer = sourceBuffer;
        this.sourceBuffer.addEventListener('error', (error) => {
            this.dispatch('error', {
                name: 'buffer',
                type: this.type,
                error: 'buffer error',
                details: error,
            });
        });
        this.sourceBuffer.addEventListener('updateend', () => {
            if (this.pendingCleaning > 0) {
                this.initCleanup(this.pendingCleaning);
                this.pendingCleaning = 0;
            }
            
            this.cleaning = false;
            
            if (this.cleanRanges.length) {
                this.doCleanup();
                return;
            }
        });
    }
    
    feed (data) {
        return new Promise((resolve) => {
            this.queue = appendByteArray(this.queue, data);
            resolve(this);
        });
    }
    
    destroy () {
        this.queue = null;
        this.sourceBuffer = null;
        
        this.offAll();
    }
    
    doAppend () {
        if (!this.queue.length)
            return;
        
        if (!this.sourceBuffer || this.sourceBuffer.updating)
            return;
        
        try {
            this.sourceBuffer.appendBuffer(this.queue);
            this.queue = new Uint8Array();
        }
        catch (exception) {
            let name = 'unexpectedError';
            if (exception.name === 'QuotaExceededError') {
                debug.log(`${this.type} buffer quota full`);
                name = 'QuotaExceeded';
            }
            else {
                debug.error(`Error occured while appending ${this.type} buffer - ${exception.name}: ${exception.message}`);
                name = 'InvalidStateError';
            }
            
            this.dispatch('error', {
                name: name,
                type: this.type,
                error: 'buffer error',
                details: exception,
            });
        }
    }
    
    doCleanup () {
        if (!this.cleanRanges.length) {
            this.cleaning = false;
            return;
        }
        
        let range = this.cleanRanges.shift();
        
        this.cleaning = true;
        this.sourceBuffer.remove(range[0], range[1]);
    }
    
    initCleanup (cleanMaxLimit) {
        try {
            if (this.sourceBuffer.updating) {
                this.pendingCleaning = cleanMaxLimit;
                return;
            }
            if (this.sourceBuffer.buffered && this.sourceBuffer.buffered.length && !this.cleaning) {
                for (let i = 0; i < this.sourceBuffer.buffered.length; ++ i) {
                    let start = this.sourceBuffer.buffered.start(i);
                    let end = this.sourceBuffer.buffered.end(i);
                    
                    if ((cleanMaxLimit - start) > this.cleanOffset) {
                        end = cleanMaxLimit - this.cleanOffset;
                        if (start < end) {
                            this.cleanRanges.push([start, end]);
                        }
                    }
                }
                this.doCleanup();
            }
        }
        catch (e) {
            debug.error(`Error occured while cleaning ${this.type} buffer - ${e.name}: ${e.message}`);
        }
    }
}

export class FPSMonitor {
    constructor () {
        this.timestamps = [];
        this.maxSamples = 30;
    }
    
    addFrame (pts) {
        this.timestamps.push(pts);
        
        if (this.timestamps.length > this.maxSamples)
            this.timestamps.shift();
    }
    
    getFPS () {
        if (this.timestamps.length < 2)
            return 0;
        
        let intervals = [];
        for (let i = 1; i < this.timestamps.length; i ++) {
            intervals.push(this.timestamps[i] - this.timestamps[i - 1]);
        }
        
        let avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        return avgInterval > 0 ? (1 / avgInterval) : 0;
    }
}
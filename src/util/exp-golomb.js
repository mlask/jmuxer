/**
 * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
*/

export class ExpGolomb {
    constructor (data, ebsp2rbsp = false) {
        this.data = ebsp2rbsp ? this.#ebsp2rbsp(data) : data;
        this.index = 0;
        this.bitLength = data.byteLength * 8;
    }
    
    get bitsAvailable () {
        return this.bitLength - this.index;
    }
    
    skipLZ () {
        let leadingZeroCount;
        for (leadingZeroCount = 0; leadingZeroCount < this.bitLength - this.index; ++ leadingZeroCount) {
            if (this.getBits(1, this.index + leadingZeroCount, false) !== 0) {
                this.index += leadingZeroCount;
                return leadingZeroCount;
            }
        }
        
        return leadingZeroCount;
    }
    
    readEG () {
        const value = this.readUEG();
        if (0x01 & value)
            return (1 + value) >>> 1; // the number is odd if the low order bit is set, add 1 to make it even, and divide by 2
        else
            return -1 * (value >>> 1); // divide by two then make it negative
    }
    
    skipEG () {
        this.skipBits(1 + this.skipLZ());
    }
    
    getBits (size, offsetBits, moveIndex = true) {
        if (this.bitsAvailable < size)
            return 0;
        
        const offset = offsetBits % 8;
        const byte = this.data[(offsetBits / 8) | 0] & (0xff >>> offset);
        const bits = 8 - offset;
        
        if (bits >= size) {
            if (moveIndex)
                this.index += size;
            
            return byte >> (bits - size);
        }
        else {
            if (moveIndex)
                this.index += bits;
            
            const nextSize = size - bits;
            return (byte << nextSize) | this.getBits(nextSize, offsetBits + bits, moveIndex);
        }
    }
    
    readUEG () {
        const prefix = this.skipLZ();
        return this.readBits(prefix + 1) - 1;
    }
    
    setData (data) {
        this.data = data;
        this.index = 0;
        this.bitLength = data.byteLength * 8;
    }
    
    skipUEG () {
        this.skipBits(1 + this.skipLZ());
    }
    
    readBits (size, moveIndex = true) {
        return this.getBits(size, this.index, moveIndex);
    }
    
    readUInt () {
        return this.readBits(32);
    }
    
    skipBits (size) {
        if (this.bitsAvailable < size)
            return false;
        
        this.index += size;
    }
    
    readUByte (numberOfBytes = 1) {
        return this.readBits((numberOfBytes * 8));
    }
    
    readUShort () {
        return this.readBits(16);
    }
    
    readBoolean () {
        return this.readBits(1) === 1;
    }
    
    #ebsp2rbsp (data) {
        const ret = new Uint8Array(data.byteLength);
        let retIndex = 0;
        
        for (let i = 0; i < data.byteLength; i ++) {
            if (i >= 2) {
                if (data[i] == 0x03 && data[i - 1] == 0x00 && data[i - 2] == 0x00) {
                    continue;
                }
            }
            
            ret[retIndex] = data[i];
            retIndex ++;
        }
        
        return new Uint8Array(ret.buffer, 0, retIndex);
    }
}

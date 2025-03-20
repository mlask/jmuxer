export class Stream {
    static NalUnitIsH265 (data) {
        if (data.length >= 2) {
            const forbidden_zero_bit = data[0] >> 7;
            const nal_unit_type_h264 = data[0] & 0x1f;
            const nal_unit_type_h265 = (data[0] >> 1) & 0x3f;
            const nuh_temporal_id_plus1 = data[1] & 0x07;
            
            const _check_6bits = data[1] & 0x3f; // for *most* h265 NAL units, last 6 bits of 2nd byte equals `1`
            
            return forbidden_zero_bit === 0 && (nal_unit_type_h265 >= 0 && nal_unit_type_h265 < 64) && (nal_unit_type_h264 > 31 || (nal_unit_type_h264 <= 31 && nuh_temporal_id_plus1 > 0 && _check_6bits === 1));
        }
        return false;
    }
    
    static extractNalUnits (buffer, codec = 'avc') {
        const length = buffer.byteLength;
        let i = 0;
        let left;
        let value;
        let state = 0;
        let result = [];
        let lastIndex = 0;
        
        while (i < length) {
            value = buffer[i ++];
            
            // finding 3 or 4-byte start codes (00 00 01 or 00 00 00 01)
            switch (state) {
                case 0:
                    state = value === 0 ? 1 : 0;
                    break;
                    
                case 1:
                    state = value === 0 ? 2 : 0;
                    break;
                    
                case 2:
                case 3:
                    if (value === 1 && i < length) {
                        if (lastIndex !== (i - state - 1))
                            result.push(buffer.subarray(lastIndex, i - state - 1));
                        
                        lastIndex = i;
                        state = 0;
                    }
                    else
                        state = value === 0 ? 3 : 0;
                    break;
                    
                default:
                    break;
            }
        }
        
        if (lastIndex < length)
            left = buffer.subarray(lastIndex, length);
        
        // result = NALu
        // left = buffer
        return [
            result,
            left,
        ];
    }
}
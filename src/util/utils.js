export function appendByteArray(buffer1, buffer2) {
    let tmp = new Uint8Array((buffer1.byteLength|0) + (buffer2.byteLength|0));
    tmp.set(buffer1, 0);
    tmp.set(buffer2, buffer1.byteLength|0);
    return tmp;
}

export function secToTime(sec) {
    let seconds,
        hours,
        minutes,
        result = '';

    seconds = Math.floor(sec);
    hours = parseInt(seconds / 3600, 10) % 24;
    minutes = parseInt(seconds / 60, 10) % 60;
    seconds = (seconds < 0) ? 0 : seconds % 60;

    if (hours > 0) {
        result += (hours < 10 ? '0' + hours : hours) + ':';
    }
    result += (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    return result;
}

export function isHEVC(payload) {
    if (payload.length > 1) {
        let hevc_f = payload[0] >> 7;
        let hevc_type = (payload[0] >> 1) & 0x3f;
        let hevc_layerid = (payload[0] & 1) << 5 | (payload[1] >> 3) & 0x1f;
        let hevc_tid = payload[1] & 0x0f;
        return hevc_f === 0 && hevc_layerid === 0 && hevc_tid === 1 && (hevc_type === 1 || hevc_type === 19 || hevc_type === 32 || hevc_type === 33 || hevc_type === 34 || hevc_type === 39);
    }
    return false;
}
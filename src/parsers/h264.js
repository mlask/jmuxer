import { ExpGolomb } from '../util/exp-golomb.js';
import * as debug from '../util/debug';
import { H265NalUnit } from './h265.js';

export class H264Parser {
    #profilesWithOptionalSPSData = [100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134];
    
    constructor (remuxer) {
        this.track = remuxer.mp4track;
        this.remuxer = remuxer;
    }
    
    readSPS (data) {
        const eg = new ExpGolomb(data);
        let calcFps;
        
        // skip NAL header
        eg.readUByte();
        
        const profile_idc = eg.readUByte(); // profile_idc u(8)
        eg.readUByte(); // constraint_set[0-5]_flag v(1) + reserved_zero_2bits u(2)
        eg.readUByte(); // level_idc u(8)
        eg.skipUEG(); // seq_parameter_set_id ue(v)
        
        // some profiles have more optional data we don't need
        if (this.#profilesWithOptionalSPSData.indexOf(profile_idc) >= 0) {
            const chroma_format_idc = eg.readUEG(); // chroma_format_idc ue(v)
            if (chroma_format_idc === 3) {
                eg.skipBits(1); // separate_colour_plane_flag u(1)
            }
            
            eg.skipUEG(); // bit_depth_luma_minus8 ue(v)
            eg.skipUEG(); // bit_depth_chroma_minus8 ue(v)
            eg.skipBits(1); // qpprime_y_zero_transform_bypass_flag u(1)
            
            if (eg.readBoolean()) {  // seq_scaling_matrix_present_flag u(1)
                for (let i = 0; i < (chroma_format_idc !== 3 ? 8 : 12); i ++) {
                    if (eg.readBoolean()) { // seq_scaling_list_present_flag[i] u(1)
                        this.#skipScalingList(i < 6 ? 16 : 64, eg);
                    }
                }
            }
        }
        
        eg.skipUEG(); // log2_max_frame_num_minus4 ue(v)
        
        const pic_order_cnt_type = eg.readUEG(); // pic_order_cnt_type ue(v)
        if (pic_order_cnt_type === 0) {
            eg.skipUEG(); // log2_max_pic_order_cnt_lsb_minus4 ue(v)
        }
        else if (pic_order_cnt_type === 1) {
            eg.skipBits(1); // delta_pic_order_always_zero_flag u(1)
            eg.skipEG(); // offset_for_non_ref_pic se(v)
            eg.skipEG(); // offset_for_top_to_bottom_field se(v)
            
            const num_ref_frames_in_pic_order_cnt_cycle = eg.readUEG(); // num_ref_frames_in_pic_order_cnt_cycle ue(v)
            for (let i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i ++) {
                eg.skipEG(); // offset_for_ref_frame[i] se(v)
            }
        }
        
        eg.skipUEG(); // max_num_ref_frames ue(v)
        eg.skipBits(1); // gaps_in_frame_num_value_allowed_flag u(1)
        
        const pic_width_in_mbs_minus1 = eg.readUEG(); // pic_width_in_mbs_minus1 ue(v)
        const pic_height_in_map_units_minus1 = eg.readUEG(); // pic_height_in_map_units_minus1 ue(v)
        const frame_mbs_only_flag = eg.readBits(1); // frame_mbs_only_flag u(1)
        if (frame_mbs_only_flag === 0) {
            eg.skipBits(1); // mb_adaptive_frame_field_flag u(1)
        }
        
        eg.skipBits(1); // direct_8x8_inference_flag u(1)
        
        let frame_crop_left_offset = 0;
        let frame_crop_right_offset = 0;
        let frame_crop_top_offset = 0;
        let frame_crop_bottom_offset = 0;
        if (eg.readBoolean()) { // frame_cropping_flag u(1)
            frame_crop_left_offset = eg.readUEG(); // frame_crop_left_offset ue(v)
            frame_crop_right_offset = eg.readUEG(); // frame_crop_right_offset ue(v)
            frame_crop_top_offset = eg.readUEG(); // frame_crop_top_offset ue(v)
            frame_crop_bottom_offset = eg.readUEG(); // frame_crop_bottom_offset ue(v)
        }
        
        let pixelRatio = [1, 1];
        if (eg.readBoolean()) { // vui_parameters_present_flag u(1)
            if (eg.readBoolean()) { // aspect_ratio_info_present_flag u(1)
                const aspect_ratio_idc = eg.readUByte(); // aspect_ratio_idc u(8)
                const pixelRatioTable = [
                    [1, 1], [12, 11], [10, 11], [16, 11],
                    [40, 33], [24, 11], [20, 11], [32, 11],
                    [80, 33], [18, 11], [15, 11], [64, 33],
                    [160, 99], [4, 3], [3, 2], [2, 1],
                ];
                
                if (aspect_ratio_idc > 0 && aspect_ratio_idc <= 16) {
                    pixelRatio = pixelRatioTable[aspect_ratio_idc - 1];
                }
                else if (aspect_ratio_idc === 255) {
                    pixelRatio = [
                        eg.readUByte(2),
                        eg.readUByte(2),
                    ];
                }
            }
            
            if (eg.readBoolean()) { // overscan_info_present_flag u(1)
                eg.skipBits(1); // overscan_appropriate_flag u(1)
            }
            
            if (eg.readBoolean()) { // video_signal_type_present_flag u(1)
                eg.skipBits(4); // video_format u(3) + video_full_range_flag u(1)
                
                if (eg.readBoolean()) { // colour_description_present_flag u(1)
                    eg.skipBits(24); // colour_primaries u(8) + transfer_characteristics u(8) + matrix_coefficients u(8)
                }
            }
            
            if (eg.readBoolean()) { // chroma_loc_info_present_flag u(1)
                eg.skipUEG(); // chroma_sample_loc_type_top_field ue(v)
                eg.skipUEG(); // chroma_sample_loc_type_bottom_field ue(v)
            }
            
            if (eg.readBoolean()) { // timing_info_present_flag u(1)
                const num_units_in_tick  = eg.readUInt(); // num_units_in_tick u(32)
                const time_scale = eg.readUInt(); // time_scale u(32)
                const fixed_frame_rate_flag = eg.readBoolean(); // fixed_frame_rate_flag u(1)
                
                if (fixed_frame_rate_flag)
                    calcFps = time_scale / (2 * num_units_in_tick);
            }
        }
        
        return {
            fps: calcFps,
            width: Math.ceil((pic_width_in_mbs_minus1 + 1) * 16 - frame_crop_left_offset * 2 - frame_crop_right_offset * 2),
            height: (2 - frame_mbs_only_flag) * (pic_height_in_map_units_minus1 + 1) * 16 - (frame_mbs_only_flag ? 2 : 4) * (frame_crop_top_offset + frame_crop_bottom_offset),
            pixelRatio: pixelRatio,
        };
    }
    
    parseNAL (unit) {
        if (!unit)
            return false;
        
        let push = false;
        switch (unit.getType()) {
            case H264NalUnit.NALU_TYPE_NDR:
            case H264NalUnit.NALU_TYPE_IDR:
                push = true;
                break;
            
            case H264NalUnit.NALU_TYPE_PPS:
                if (!this.track.pps) {
                    this.parsePPS(unit.getPayload());
                    
                    if (!this.remuxer.readyToDecode && this.track.sps && this.track.pps)
                        this.remuxer.readyToDecode = true;
                }
                push = true;
                break;
            
            case H264NalUnit.NALU_TYPE_SPS:
                if (!this.track.sps) {
                    this.parseSPS(unit.getPayload());
                    
                    if (!this.remuxer.readyToDecode && this.track.sps && this.track.pps)
                        this.remuxer.readyToDecode = true;
                }
                push = true;
                break;
            
            default:
                debug.log(`H264Parser: unsupported NAL type: ${unit.getType()}`);
        }
        
        return push;
    }
    
    parsePPS (data) {
        this.track.pps = [
            new Uint8Array(data),
        ];
    }
    
    parseSPS (data) {
        const sps = new Uint8Array(data);
        const config = this.readSPS(sps);
        
        this.track.fps = config.fps || this.track.fps;
        this.track.sps = [sps];
        this.track.codec = 'avc1.';
        this.track.width = config.width;
        this.track.height = config.height;
        this.track.segmentCodec = 'avc';
        
        const codecarray = sps.subarray(1, 4);
        for (let i = 0; i < 3; i ++) {
            let h = codecarray[i].toString(16);
            if (h.length < 2)
                h = '0' + h;
            this.track.codec += h;
        }
        
        console.log(`h264 codec: ${this.track.codec}`);
    }
    
    #skipScalingList (count, reader) {
        let lastScale = 8;
        let nextScale = 8;
        let deltaScale;
        
        for (let j = 0; j < count; j ++) {
            if (nextScale !== 0) {
                deltaScale = reader.readEG();
                nextScale = (lastScale + deltaScale + 256) % 256;
            }
            
            lastScale = (nextScale === 0) ? lastScale : nextScale;
        }
    }
}

export class H264NalUnit {
    static NALU_TYPE_NDR = 0x01;
    static NALU_TYPE_IDR = 0x05;
    static NALU_TYPE_SEI = 0x06;
    static NALU_TYPE_SPS = 0x07;
    static NALU_TYPE_PPS = 0x08;
    static NALU_TYPE_AUD = 0x09;
    static NALU_TYPE_FILLER_DATA = 0x0c;
    
    constructor (data) {
        this.type = data[0] & 0x1f;
        this.isfmb = false;
        this.isvcl = this.type === H264NalUnit.NALU_TYPE_NDR || this.type === H264NalUnit.NALU_TYPE_IDR;
        this.stype = undefined;
        this.payload = data;
        
        if (this.isvcl)
            this.#parseHeader();
    }
    
    getData () {
        const result = new Uint8Array(this.getSize());
        const view = new DataView(result.buffer);
        
        view.setUint32(0, this.getSize() - 4);
        result.set(this.getPayload(), 4);
        
        return result;
    }
    
    getSize () {
        return 4 + this.getPayloadSize();
    }
    
    getType () {
        return this.type;
    }
    
    initParser (remuxer) {
        return new H264Parser(remuxer);
    }
    
    getPayload () {
        return this.payload;
    }
    
    isKeyframe () {
        return this.type === H264NalUnit.NALU_TYPE_IDR;
    }
    
    getPayloadSize () {
        return this.payload.byteLength;
    }
    
    #parseHeader () {
        const eg = new ExpGolomb(this.payload);
        
        // skip NALu type
        eg.readUByte();
        
        this.isfmb = eg.readUEG() === 0; // first_mb_in_slice
        this.stype = eg.readUEG(); // slice_type
    }
}
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
        const readUByte = eg.readUByte.bind(eg);
        const readUInt = eg.readUInt.bind(eg);
        const readBits = eg.readBits.bind(eg);
        const readUEG = eg.readUEG.bind(eg);
        const readBoolean = eg.readBoolean.bind(eg);
        const skipBits = eg.skipBits.bind(eg);
        const skipEG = eg.skipEG.bind(eg);
        const skipUEG = eg.skipUEG.bind(eg);
        const skipScalingList = this.#skipScalingList.bind(this);
        
        let frameCropLeftOffset = 0;
        let frameCropRightOffset = 0;
        let frameCropTopOffset = 0;
        let frameCropBottomOffset = 0;
        let numRefFramesInPicOrderCntCycle;
        let scalingListCount;
        let i;
        let calcFps;
        
        readUByte();
        
        const profileIdc = readUByte(); // profile_idc u(8)
        readUByte(); // constraint_set[0-5]_flag
        readUByte(); // level_idc u(8)
        skipUEG(); // seq_parameter_set_id
        
        // some profiles have more optional data we don't need
        if (this.#profilesWithOptionalSPSData.indexOf(profileIdc) >= 0) {
            const chromaFormatIdc = readUEG();
            if (chromaFormatIdc === 3) {
                skipBits(1);
            } // separate_colour_plane_flag
            
            skipUEG(); // bit_depth_luma_minus8
            skipUEG(); // bit_depth_chroma_minus8
            skipBits(1); // qpprime_y_zero_transform_bypass_flag
            
            if (readBoolean()) {
                // seq_scaling_matrix_present_flag
                scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;
                for (i = 0; i < scalingListCount; i ++) {
                    if (readBoolean()) {
                        // seq_scaling_list_present_flag[ i ]
                        if (i < 6)
                            skipScalingList(16, eg);
                        else
                            skipScalingList(64, eg);
                    }
                }
            }
        }
        
        skipUEG(); // log2_max_frame_num_minus4
        
        const picOrderCntType = readUEG();
        if (picOrderCntType === 0) {
            readUEG(); // log2_max_pic_order_cnt_lsb_minus4
        }
        else if (picOrderCntType === 1) {
            skipBits(1); // delta_pic_order_always_zero_flag
            skipEG(); // offset_for_non_ref_pic
            skipEG(); // offset_for_top_to_bottom_field
            
            numRefFramesInPicOrderCntCycle = readUEG();
            for (i = 0; i < numRefFramesInPicOrderCntCycle; i ++) {
                skipEG();
            } // offset_for_ref_frame[ i ]
        }
        
        skipUEG(); // max_num_ref_frames
        skipBits(1); // gaps_in_frame_num_value_allowed_flag
        
        const picWidthInMbsMinus1 = readUEG();
        const picHeightInMapUnitsMinus1 = readUEG();
        const frameMbsOnlyFlag = readBits(1);
        if (frameMbsOnlyFlag === 0) {
            skipBits(1);
        } // mb_adaptive_frame_field_flag
        
        skipBits(1); // direct_8x8_inference_flag
        if (readBoolean()) {
            // frame_cropping_flag
            frameCropLeftOffset = readUEG();
            frameCropRightOffset = readUEG();
            frameCropTopOffset = readUEG();
            frameCropBottomOffset = readUEG();
        }
        
        let pixelRatio = [1, 1];
        if (readBoolean()) {
            // vui_parameters_present_flag
            
            if (readBoolean()) {
                // aspect_ratio_info_present_flag
                const aspectRatioIdc = readUByte();
                const pixelRatioTable = [
                    [1, 1], [12, 11], [10, 11], [16, 11],
                    [40, 33], [24, 11], [20, 11], [32, 11],
                    [80, 33], [18, 11], [15, 11], [64, 33],
                    [160, 99], [4, 3], [3, 2], [2, 1],
                ];
                
                if (aspectRatioIdc > 0 && aspectRatioIdc <= 16) {
                    pixelRatio = pixelRatioTable[aspectRatioIdc - 1];
                }
                else if (aspectRatioIdc === 255) {
                    pixelRatio = [
                        (readUByte() << 8) | readUByte(),
                        (readUByte() << 8) | readUByte(),
                    ];
                }
            }
            
            if (readBoolean()) {
                // overscan_info_present_flag
                skipBits(1);
            }
            
            if (readBoolean()) {
                // video_signal_type_present_flag
                skipBits(4);
                
                if (readBoolean()) {
                    // colour_description_present_flag
                    skipBits(24);
                }
            }
            
            if (readBoolean()) {
                // chroma_loc_info_present_flag
                skipUEG();
                skipUEG();
            }
            
            if (readBoolean()) {
                // timing_info_present_flag
                const numUnitsInTick = readUInt();
                const timeScale = readUInt();
                const fixedFrameRateFlag = readBoolean();
                
                const frameDuration = timeScale / (2 * numUnitsInTick);
                if (fixedFrameRateFlag)
                    calcFps = frameDuration;
            }
        }
        
        return {
            fps: calcFps,
            width: Math.ceil((picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2),
            height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - (frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset),
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
import { ExpGolomb } from '../util/exp-golomb.js';
import * as debug from '../util/debug';

export class H265Parser {
    constructor (remuxer) {
        this.track = remuxer.mp4track;
        this.remuxer = remuxer;
        this.estimate_fps = null;
    }
    
    readPPS (data) {
        const eg = new ExpGolomb(data, true);
        
        // remove NALu Header
        eg.readUByte();
        eg.readUByte();
        
        // PPS
        eg.readUEG();// pic_parameter_set_id
        eg.readUEG(); // seq_parameter_set_id
        eg.readBoolean(); // dependent_slice_segments_enabled_flag
        eg.readBoolean(); // output_flag_present_flag
        eg.readBits(3); // num_extra_slice_header_bits
        eg.readBoolean(); // sign_data_hiding_enabled_flag
        eg.readBoolean(); // cabac_init_present_flag
        eg.readUEG(); // num_ref_idx_l0_default_active_minus1
        eg.readUEG(); // num_ref_idx_l1_default_active_minus1
        eg.readEG(); // init_qp_minus26
        eg.readBoolean(); // constrained_intra_pred_flag
        eg.readBoolean(); // transform_skip_enabled_flag
        const cu_qp_delta_enabled_flag = eg.readBoolean();
        if (cu_qp_delta_enabled_flag) {
            eg.readUEG(); // diff_cu_qp_delta_depth
        }
        eg.readEG(); // cb_qp_offset
        eg.readEG(); // cr_qp_offset
        eg.readBoolean(); // pps_slice_chroma_qp_offsets_present_flag
        eg.readBoolean(); // weighted_pred_flag
        eg.readBoolean(); // weighted_bipred_flag
        eg.readBoolean(); // transquant_bypass_enabled_flag
        
        const tiles_enabled_flag = eg.readBoolean();
        const entropy_coding_sync_enabled_flag = eg.readBoolean();
        
        // needs hvcC
        let parallelism_type = 1; // slice-based parallel decoding
        if (entropy_coding_sync_enabled_flag && tiles_enabled_flag)
            parallelism_type = 0; // mixed-type parallel decoding
        else if (entropy_coding_sync_enabled_flag)
            parallelism_type = 3; // wavefront-based parallel decoding
        else if (tiles_enabled_flag)
            parallelism_type = 2; // tile-based parallel decoding
        
        return {
            parallelism_type,
        };
    }
    
    readSPS (data) {
        const eg = new ExpGolomb(data, true);
        
        // remove NALu Header
        eg.readUByte();
        eg.readUByte();
        
        // SPS
        eg.readBits(4); // video_parameter_set_id
        const sps_max_sub_layers_minus1 = eg.readBits(3);
        eg.readBoolean(); // temporal_id_nesting_flag
        
        // profile_tier_level begin
        const general_profile_space = eg.readBits(2);
        const general_tier_flag = eg.readBoolean();
        const general_profile_idc = eg.readBits(5);
        const general_profile_compatibility_flags = [
            eg.readUByte(),
            eg.readUByte(),
            eg.readUByte(),
            eg.readUByte(),
        ];
        const general_constraint_indicator_flags = [
            eg.readUByte(),
            eg.readUByte(),
            eg.readUByte(),
            eg.readUByte(),
            eg.readUByte(),
            eg.readUByte(),
        ];
        const general_level_idc = eg.readUByte();
        const sub_layer_profile_present_flag = [];
        const sub_layer_level_present_flag = [];
        
        for (let i = 0; i < sps_max_sub_layers_minus1; i ++) {
            sub_layer_profile_present_flag.push(eg.readBoolean());
            sub_layer_level_present_flag.push(eg.readBoolean());
        }
        
        if (sps_max_sub_layers_minus1 > 0) {
            for (let i = sps_max_sub_layers_minus1; i < 8; i ++) {
                eg.readBits(2);
            }
        }
        
        for (let i = 0; i < sps_max_sub_layers_minus1; i ++) {
            if (sub_layer_profile_present_flag[i]) {
                eg.readBits(88);
            }
            if (sub_layer_level_present_flag[i]) {
                eg.readUByte();
            }
        }
        // profile_tier_level end
        
        eg.readUEG(); // seq_parameter_set_id
        const chroma_format_idc = eg.readUEG();
        if (chroma_format_idc === 3) {
            eg.skipBits(1); // separate_colour_plane_flag
        }
        const pic_width_in_luma_samples = eg.readUEG();
        const pic_height_in_luma_samples = eg.readUEG();
        const conformance_window_flag = eg.readBoolean();
        let conf_win_left_offset = 0;
        let conf_win_right_offset = 0;
        let conf_win_top_offset = 0;
        let conf_win_bottom_offset = 0;
        if (conformance_window_flag) {
            conf_win_left_offset += eg.readUEG();
            conf_win_right_offset += eg.readUEG();
            conf_win_top_offset += eg.readUEG();
            conf_win_bottom_offset += eg.readUEG();
        }
        const bit_depth_luma_minus8 = eg.readUEG();
        const bit_depth_chroma_minus8 = eg.readUEG();
        const log_2_max_pic_order_cnt_lsb_minus4 = eg.readUEG();
        const sps_sub_layer_ordering_info_present_flag = eg.readBoolean();
        for (let i = sps_sub_layer_ordering_info_present_flag ? 0 : sps_max_sub_layers_minus1; i <= sps_max_sub_layers_minus1; i ++) {
            eg.skipUEG(); // max_dec_pic_buffering_minus1[i]
            eg.skipUEG(); // max_num_reorder_pics[i]
            eg.skipUEG(); // max_latency_increase_plus1[i]
        }
        eg.skipUEG(); // log2_min_luma_coding_block_size_minus3
        eg.skipUEG(); // log2_diff_max_min_luma_coding_block_size
        eg.skipUEG(); // log2_min_transform_block_size_minus2
        eg.skipUEG(); // log2_diff_max_min_transform_block_size
        eg.skipUEG(); // max_transform_hierarchy_depth_inter
        eg.skipUEG(); // max_transform_hierarchy_depth_intra
        const scaling_list_enabled_flag = eg.readBoolean();
        if (scaling_list_enabled_flag) {
            const sps_scaling_list_data_present_flag = eg.readBoolean();
            if (sps_scaling_list_data_present_flag) {
                for (let sizeId = 0; sizeId < 4; sizeId ++) {
                    for (let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId ++) {
                        const scaling_list_pred_mode_flag = eg.readBoolean();
                        if (!scaling_list_pred_mode_flag) {
                            eg.readUEG(); // scaling_list_pred_matrix_id_delta
                        }
                        else {
                            const coefNum = Math.min(64, 1 << (4 + (sizeId << 1)));
                            if (sizeId > 1) {
                                eg.readEG();
                            }
                            for (let i = 0; i < coefNum; i ++) {
                                eg.readEG();
                            }
                        }
                    }
                }
            }
        }
        
        eg.readBoolean(); // amp_enabled_flag
        eg.readBoolean(); // sample_adaptive_offset_enabled_flag
        
        const pcm_enabled_flag = eg.readBoolean();
        if (pcm_enabled_flag) {
            eg.readUByte();
            eg.skipUEG();
            eg.skipUEG();
            eg.readBoolean();
        }
        
        const num_short_term_ref_pic_sets = eg.readUEG();
        let numDeltaPocs = 0;
        for (let i = 0; i < num_short_term_ref_pic_sets; i ++) {
            let inter_ref_pic_set_prediction_flag = false;
            
            if (i !== 0) {
                inter_ref_pic_set_prediction_flag = eg.readBoolean();
            }
            
            if (inter_ref_pic_set_prediction_flag) {
                if (i === num_short_term_ref_pic_sets) {
                    eg.readUEG();
                }
                
                eg.readBoolean();
                eg.readUEG();
                
                let nextNumDeltaPocs = 0;
                for (let j = 0; j <= numDeltaPocs; j ++) {
                    const used_by_curr_pic_flag = eg.readBoolean();
                    let use_delta_flag = false;
                    
                    if (!used_by_curr_pic_flag) {
                        use_delta_flag = eg.readBoolean();
                    }
                    
                    if (used_by_curr_pic_flag || use_delta_flag) {
                        nextNumDeltaPocs ++;
                    }
                }
                numDeltaPocs = nextNumDeltaPocs;
            }
            else {
                const num_negative_pics = eg.readUEG();
                const num_positive_pics = eg.readUEG();
                
                numDeltaPocs = num_negative_pics + num_positive_pics;
                for (let j = 0; j < num_negative_pics; j ++) {
                    eg.readUEG();
                    eg.readBoolean();
                }
                
                for (let j = 0; j < num_positive_pics; j ++) {
                    eg.readUEG();
                    eg.readBoolean();
                }
            }
        }
        
        const long_term_ref_pics_present_flag = eg.readBoolean();
        if (long_term_ref_pics_present_flag) {
            const num_long_term_ref_pics_sps = eg.readUEG();
            for (let i = 0; i < num_long_term_ref_pics_sps; i ++) {
                for (let j = 0; j < log_2_max_pic_order_cnt_lsb_minus4 + 4; j ++) {
                    eg.readBits(1);
                }
                eg.readBits(1);
            }
        }
        
        let frame_field_info_present_flag = false;
        let min_spatial_segmentation_idc = 0; // for hvcC
        let default_display_window_flag = false; // for calc offset
        let fixed_pic_rate_general_flag = true;
        let vui_num_units_in_tick;
        let vui_time_scale;
        
        let sar_height = 1;
        let sar_width = 1;
        
        eg.readBoolean(); // sps_temporal_mvp_enabled_flag
        eg.readBoolean(); // strong_intra_smoothing_enabled_flag
        const vui_parameters_present_flag = eg.readBoolean();
        if (vui_parameters_present_flag) {
            const aspect_ratio_info_present_flag = eg.readBoolean();
            if (aspect_ratio_info_present_flag) {
                const aspect_ratio_idc = eg.readUByte();
                const sarWidthTable = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
                const sarHeightTable = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
                if (aspect_ratio_idc > 0 && aspect_ratio_idc <= 16) {
                    sar_width = sarWidthTable[aspect_ratio_idc - 1];
                    sar_height = sarHeightTable[aspect_ratio_idc - 1];
                }
                else if (aspect_ratio_idc === 255) {
                    sar_width = eg.readBits(16);
                    sar_height = eg.readBits(16);
                }
            }
            const overscan_info_present_flag = eg.readBoolean();
            if (overscan_info_present_flag) {
                eg.readBoolean();
            }
            const video_signal_type_present_flag = eg.readBoolean();
            if (video_signal_type_present_flag) {
                eg.readBits(3);
                eg.readBoolean();
                const colour_description_present_flag = eg.readBoolean();
                if (colour_description_present_flag) {
                    eg.readUByte();
                    eg.readUByte();
                    eg.readUByte();
                }
            }
            const chroma_loc_info_present_flag = eg.readBoolean();
            if (chroma_loc_info_present_flag) {
                eg.readUEG();
                eg.readUEG();
            }
            eg.readBoolean(); // neutral_chroma_indication_flag
            eg.readBoolean(); // field_seq_flag
            frame_field_info_present_flag = eg.readBoolean(); // frame_field_info_present_flag
            
            default_display_window_flag = eg.readBoolean();
            if (default_display_window_flag) {
                eg.readUEG();
                eg.readUEG();
                eg.readUEG();
                eg.readUEG();
            }
            
            const vui_timing_info_present_flag = eg.readBoolean();
            if (vui_timing_info_present_flag) {
                vui_num_units_in_tick = eg.readBits(32); // vui_num_units_in_tick
                vui_time_scale = eg.readBits(32); // vui_time_scale
                
                const vui_poc_proportional_to_timing_flag = eg.readBoolean();
                if (vui_poc_proportional_to_timing_flag) {
                    eg.readUEG();
                }
                
                const vui_hrd_parameters_present_flag = eg.readBoolean();
                if (vui_hrd_parameters_present_flag) {
                    const nal_hrd_parameters_present_flag = eg.readBoolean();
                    const vcl_hrd_parameters_present_flag = eg.readBoolean();
                    let sub_pic_hrd_params_present_flag = false;
                    if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
                        sub_pic_hrd_params_present_flag = eg.readBoolean();
                        if (sub_pic_hrd_params_present_flag) {
                            eg.readUByte();
                            eg.readBits(5);
                            eg.readBoolean();
                            eg.readBits(5);
                        }
                        
                        eg.readBits(4); // bit_rate_scale
                        eg.readBits(4); // cpb_size_scale
                        
                        if (sub_pic_hrd_params_present_flag) {
                            eg.readBits(4);
                        }
                        
                        eg.readBits(5);
                        eg.readBits(5);
                        eg.readBits(5);
                    }
                    
                    for (let i = 0; i <= sps_max_sub_layers_minus1; i ++) {
                        fixed_pic_rate_general_flag = eg.readBoolean();
                        const fixed_pic_rate_within_cvs_flag = fixed_pic_rate_general_flag || eg.readBoolean();
                        let low_delay_hrd_flag = false;
                        
                        if (fixed_pic_rate_within_cvs_flag) {
                            eg.readUEG();
                        }
                        else {
                            low_delay_hrd_flag = eg.readBoolean();
                        }
                        
                        const cpb_cnt = low_delay_hrd_flag ? 1 : eg.readUEG() + 1;
                        
                        if (nal_hrd_parameters_present_flag) {
                            for (let j = 0; j < cpb_cnt; j ++) {
                                eg.readUEG();
                                eg.readUEG();
                                
                                if (sub_pic_hrd_params_present_flag) {
                                    eg.readUEG();
                                    eg.readUEG();
                                }
                            }
                            eg.skipBits(1);
                        }
                        
                        if (vcl_hrd_parameters_present_flag) {
                            for (let j = 0; j < cpb_cnt; j ++) {
                                eg.readUEG();
                                eg.readUEG();
                                
                                if (sub_pic_hrd_params_present_flag) {
                                    eg.readUEG();
                                    eg.readUEG();
                                }
                            }
                            eg.skipBits(1);
                        }
                    }
                }
            }
            
            const bitstream_restriction_flag = eg.readBoolean();
            if (bitstream_restriction_flag) {
                eg.readBoolean(); // tiles_fixed_structure_flag
                eg.readBoolean(); // motion_vectors_over_pic_boundaries_flag
                eg.readBoolean(); // restricted_ref_pic_lists_flag
                min_spatial_segmentation_idc = eg.readUEG();
            }
        }
        
        let width = pic_width_in_luma_samples;
        let height = pic_height_in_luma_samples;
        if (conformance_window_flag || default_display_window_flag) {
            let chroma_scale_w = 1;
            let chroma_scale_h = 1;
            
            if (chroma_format_idc === 1) {
                // YUV 420
                chroma_scale_w = chroma_scale_h = 2;
            }
            else if (chroma_format_idc === 2) {
                // YUV 422
                chroma_scale_w = 2;
            }
            
            width = pic_width_in_luma_samples - chroma_scale_w * conf_win_right_offset - chroma_scale_w * conf_win_left_offset;
            height = pic_height_in_luma_samples - chroma_scale_h * conf_win_bottom_offset - chroma_scale_h * conf_win_top_offset;
        }
        
        return {
            general_level_idc,
            general_profile_space,
            general_tier_flag,
            general_profile_idc,
            general_profile_compatibility_flags,
            general_constraint_indicator_flags,
            min_spatial_segmentation_idc,
            frame_field_info_present_flag,
            frame_rate: {
                fixed: fixed_pic_rate_general_flag ? 1 : 0,
                fps: vui_time_scale / vui_num_units_in_tick,
            },
            chroma_format_idc,
            bit_depth_luma_minus8,
            bit_depth_chroma_minus8,
            width,
            height,
            pixelRatio: [
                sar_width,
                sar_height,
            ],
        };
    }
    
    readVPS (data) {
        const eg = new ExpGolomb(data, true);
        
        // remove NALu Header
        eg.readUByte();
        eg.readUByte();
        
        // VPS
        eg.readBits(4); // vps_video_parameter_set_id
        eg.skipBits(1); // vps_base_layer_internal_flag
        eg.skipBits(1); // vps_base_layer_available_flag
        eg.readBits(6); // vps_max_layers_minus1
        const vps_max_sub_layers_minus1 = eg.readBits(3);
        const vps_temporal_id_nesting_flag = eg.readBoolean();
        
        return {
            num_temporal_layers: vps_max_sub_layers_minus1 + 1,
            temporal_id_nested: vps_temporal_id_nesting_flag,
        };
    }
    
    parseNAL (unit) {
        if (!unit)
            return false;
        
        let push = false;
        let isKeyframe = false;
        
        switch (unit.getType()) {
            case H265NalUnit.NALU_TYPE_TRAIL_N:
            case H265NalUnit.NALU_TYPE_TRAIL_R:
            case H265NalUnit.NALU_TYPE_TSA_N:
            case H265NalUnit.NALU_TYPE_TSA_R:
            case H265NalUnit.NALU_TYPE_STSA_N:
            case H265NalUnit.NALU_TYPE_STSA_R:
            case H265NalUnit.NALU_TYPE_RADL_N:
            case H265NalUnit.NALU_TYPE_RADL_R:
            case H265NalUnit.NALU_TYPE_RASL_N:
            case H265NalUnit.NALU_TYPE_RASL_R:
                push = true;
                break;
            
            case H265NalUnit.NALU_TYPE_IDR_W_RADL:
            case H265NalUnit.NALU_TYPE_IDR_N_LP:
            case H265NalUnit.NALU_TYPE_CRA_NUT:
                push = true;
                isKeyframe = true;
                break;
            
            case H265NalUnit.NALU_TYPE_VPS_NUT:
                if (!this.track.vps) {
                    this.parseVPS(unit.getPayload());
                    
                    if (!this.remuxer.readyToDecode && this.track.vps && this.track.sps && this.track.pps)
                        this.remuxer.readyToDecode = true;
                }
                push = true;
                break;
            
            case H265NalUnit.NALU_TYPE_SPS_NUT:
                if (!this.track.sps) {
                    this.parseSPS(unit.getPayload());
                    
                    if (!this.remuxer.readyToDecode && this.track.vps && this.track.sps && this.track.pps)
                        this.remuxer.readyToDecode = true;
                }
                push = true;
                break;
            
            case H265NalUnit.NALU_TYPE_PPS_NUT:
                if (!this.track.pps) {
                    this.parsePPS(unit.getPayload());
                    
                    if (!this.remuxer.readyToDecode && this.track.vps && this.track.sps && this.track.pps)
                        this.remuxer.readyToDecode = true;
                }
                push = true;
                break;
            
            case H265NalUnit.NALU_TYPE_SEI_PREFIX:
            case H265NalUnit.NALU_TYPE_SEI_SUFFIX:
                this.parseSEI(unit);
                push = true;
                break;
            
            default:
                console.log('H265Parser: unsupported NAL type!', unit.getType());
        }
        
        if (isKeyframe)
            this.#estimateFPS();
        
        return push;
    }
    
    parsePPS (data) {
        const pps = new Uint8Array(data);
        const config = this.readPPS(pps);
        
        this.track.pps = [pps];
        this.track.params = Object.assign(this.track.params, config);
    }
    
    parseSEI (unit) {
        console.log(`parseSEI - unit type=${unit.getType()} payloadSize=${unit.getPayloadSize()}`);
        const data = this.#discardEPB(unit.getPayload());
        let offset = 0;
        
        while (offset < data.length) {
            let payloadType = 0;
            let payloadSize = 0;
            
            while (offset < data.length) {
                const byte = data[offset ++];
                payloadType += byte;
                if (byte !== 0xff) break;
            }
            
            while (offset < data.length) {
                const byte = data[offset ++];
                payloadSize += byte;
                if (byte !== 0xff) break;
            }
            
            if (offset + payloadSize > data.length) {
                console.log(`parseSEI - invalid SEI size (payloadType=${payloadType}, payloadSize=${payloadSize}, data.length=${data.length})`);
                break;
            }
            
            let payloadData = data.subarray(offset, offset + payloadSize);
            console.log(`parseSEI - payloadType=${payloadType}, payloadSize=${payloadSize}, payloadData`, payloadData);
            offset += payloadSize;
        }
    }
    
    parseSPS (data) {
        const sps = new Uint8Array(data);
        const config = this.readSPS(sps);
        
        this.track.sps = [sps];
        this.track.params = Object.assign(this.track.params, config);
        
        const profile_space_string = config.general_profile_space ? ['A', 'B', 'C'][config.general_profile_space] : '';
        const profile_compatibility_buf = (config.general_profile_compatibility_flags[0] << 24) | (config.general_profile_compatibility_flags[1] << 16) | (config.general_profile_compatibility_flags[2] << 8) | config.general_profile_compatibility_flags[3];
        let profile_compatibility_rev = 0;
        for (let i = 0; i < 32; i ++) {
            profile_compatibility_rev = (profile_compatibility_rev | (((profile_compatibility_buf >> i) & 1) << (31 - i))) >>> 0; // reverse bit position (and cast as UInt32)
        }
        let profile_compatibility_flags_string = profile_compatibility_rev.toString(16);
        if (config.general_profile_idc === 1 && profile_compatibility_flags_string === '2') {
            profile_compatibility_flags_string = '6';
        }
        const tier_flag_string = config.general_tier_flag ? 'H' : 'L';
        
        this.track.fps = config.frame_rate.fps || this.track.fps;
        this.track.codec = `hvc1.${profile_space_string}${config.general_profile_idc}.${profile_compatibility_flags_string}.${tier_flag_string}${config.general_level_idc}.B0`;
        this.track.width = config.width;
        this.track.height = config.height;
        this.track.segmentCodec = 'hevc';
    }
    
    parseVPS (data) {
        const vps = new Uint8Array(data);
        const config = this.readVPS(vps);
        
        this.track.vps = [vps];
        this.track.params = Object.assign(this.track.params, config);
    }
    
    #discardEPB (data) {
        const length = data.byteLength;
        const EPBPositions = [];
        let i = 1;
        
        // Find all `Emulation Prevention Bytes`
        while (i < length - 2) {
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
                EPBPositions.push(i + 2);
                i += 2;
            }
            else {
                i ++;
            }
        }
        
        // If no Emulation Prevention Bytes were found just return the original array
        if (EPBPositions.length === 0)
            return data;
        
        // Create a new array to hold the NAL unit data
        const newLength = length - EPBPositions.length;
        const newData = new Uint8Array(newLength);
        let sourceIndex = 0;
        
        for (i = 0; i < newLength; sourceIndex ++, i ++) {
            if (sourceIndex === EPBPositions[0]) {
                // Skip this byte
                sourceIndex ++;
                // Remove this position index
                EPBPositions.shift();
            }
            newData[i] = data[sourceIndex];
        }
        
        return newData;
    }
    
    #estimateFPS () {
        if (this.estimate_fps === null) {
            this.estimate_fps = {
                fps: 0,
                perf: performance.now(),
                frames: 0,
            };
        }
        
        this.estimate_fps.frames ++;
        
        if (this.estimate_fps.frames > 1)
            this.estimate_fps.fps = Math.round((performance.now() - this.estimate_fps.perf) / this.estimate_fps.frames / 1000, 2);
        
        if (this.estimate_fps.fps > 0 && this.track.fps !== this.estimate_fps.fps)
            this.track.fps = this.estimate_fps.fps;
        
        console.log(`H265Parser: estimateFPS fps=${this.estimate_fps.fps} (fps=${this.track.fps})`);
    }
}

export class H265NalUnit {
    static NALU_TYPE_TRAIL_N = 0x00;
    static NALU_TYPE_TRAIL_R = 0x01;
    static NALU_TYPE_TSA_N = 0x02;
    static NALU_TYPE_TSA_R = 0x03;
    static NALU_TYPE_STSA_N = 0x04;
    static NALU_TYPE_STSA_R = 0x05;
    static NALU_TYPE_RADL_N = 0x06;
    static NALU_TYPE_RADL_R = 0x07;
    static NALU_TYPE_RASL_N = 0x08;
    static NALU_TYPE_RASL_R = 0x09;
    static NALU_TYPE_RSV_VCL_N10 = 0x0a;
    static NALU_TYPE_RSV_VCL_N12 = 0x0b;
    static NALU_TYPE_RSV_VCL_N14 = 0x0c;
    static NALU_TYPE_RSV_VCL_R11 = 0x0d;
    static NALU_TYPE_RSV_VCL_R13 = 0x0e;
    static NALU_TYPE_RSV_VCL_R15 = 0x0f;
    static NALU_TYPE_BLA_W_LP = 0x10;
    static NALU_TYPE_BLA_W_RADL = 0x11;
    static NALU_TYPE_BLA_N_LP = 0x12;
    static NALU_TYPE_IDR_W_RADL = 0x13;
    static NALU_TYPE_IDR_N_LP = 0x14;
    static NALU_TYPE_CRA_NUT = 0x15;
    static NALU_TYPE_RSV_IRAP_VCL22 = 0x16;
    static NALU_TYPE_RSV_IRAP_VCL23 = 0x17;
    static NALU_TYPE_RSV_VCL24 = 0x18;
    static NALU_TYPE_RSV_VCL25 = 0x19;
    static NALU_TYPE_RSV_VCL26 = 0x1a;
    static NALU_TYPE_RSV_VCL27 = 0x1b;
    static NALU_TYPE_RSV_VCL28 = 0x1c;
    static NALU_TYPE_RSV_VCL29 = 0x1d;
    static NALU_TYPE_RSV_VCL30 = 0x1e;
    static NALU_TYPE_RSV_VCL31 = 0x1f;
    static NALU_TYPE_VPS_NUT = 0x20;
    static NALU_TYPE_SPS_NUT = 0x21;
    static NALU_TYPE_PPS_NUT = 0x22;
    static NALU_TYPE_AUD_NUT = 0x23;
    static NALU_TYPE_EOS_NUT = 0x24;
    static NALU_TYPE_EOB_NUT = 0x25;
    static NALU_TYPE_FD_NUT = 0x26;
    static NALU_TYPE_SEI_PREFIX = 0x27;
    static NALU_TYPE_SEI_SUFFIX = 0x28;
    static NALU_TYPE_RSV_NVCL41 = 0x29;
    static NALU_TYPE_RSV_NVCL42 = 0x2a;
    static NALU_TYPE_RSV_NVCL43 = 0x2b;
    static NALU_TYPE_RSV_NVCL44 = 0x2c;
    static NALU_TYPE_RSV_NVCL45 = 0x2d;
    static NALU_TYPE_RSV_NVCL46 = 0x2e;
    static NALU_TYPE_RSV_NVCL47 = 0x2f;
    static NALU_TYPE_UNSPEC48 = 0x30;
    static NALU_TYPE_UNSPEC49 = 0x31;
    static NALU_TYPE_UNSPEC50 = 0x32;
    static NALU_TYPE_UNSPEC51 = 0x33;
    static NALU_TYPE_UNSPEC52 = 0x34;
    static NALU_TYPE_UNSPEC53 = 0x35;
    static NALU_TYPE_UNSPEC54 = 0x36;
    static NALU_TYPE_UNSPEC55 = 0x37;
    static NALU_TYPE_UNSPEC56 = 0x38;
    static NALU_TYPE_UNSPEC57 = 0x39;
    static NALU_TYPE_UNSPEC58 = 0x3a;
    static NALU_TYPE_UNSPEC59 = 0x3b;
    static NALU_TYPE_UNSPEC60 = 0x3c;
    static NALU_TYPE_UNSPEC61 = 0x3d;
    static NALU_TYPE_UNSPEC62 = 0x3e;
    static NALU_TYPE_UNSPEC63 = 0x3f;
    
    constructor (data) {
        this.type = (data[0] >> 1) & 0x3f;
        this.isvcl = this.type >= H265NalUnit.NALU_TYPE_TRAIL_N && this.type <= H265NalUnit.NALU_TYPE_RSV_VCL31;
        this.payload = data;
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
        return new H265Parser(remuxer);
    }
    
    getPayload () {
        return this.payload;
    }
    
    isKeyframe () {
        return this.type === H265NalUnit.NALU_TYPE_IDR_W_RADL || this.type === H265NalUnit.NALU_TYPE_IDR_N_LP || this.type === H265NalUnit.NALU_TYPE_CRA_NUT;
    }
    
    getPayloadSize () {
        return this.payload.byteLength;
    }
}
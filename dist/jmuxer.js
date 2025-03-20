(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stream')) :
  typeof define === 'function' && define.amd ? define(['stream'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JMuxer = factory(global.stream));
})(this, (function (stream) { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _assertClassBrand(e, t, n) {
    if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
    throw new TypeError("Private element is not present on this object");
  }
  function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  function _callSuper(t, o, e) {
    return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
  }
  function _checkPrivateRedeclaration(e, t) {
    if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _classPrivateFieldGet2(s, a) {
    return s.get(_assertClassBrand(s, a));
  }
  function _classPrivateFieldInitSpec(e, t, a) {
    _checkPrivateRedeclaration(e, t), t.set(e, a);
  }
  function _classPrivateMethodInitSpec(e, a) {
    _checkPrivateRedeclaration(e, a), a.add(e);
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: !0
            } : {
              done: !1,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = !0,
      u = !1;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = !0, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    }, _getPrototypeOf(t);
  }
  function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: !0,
        configurable: !0
      }
    }), Object.defineProperty(t, "prototype", {
      writable: !1
    }), e && _setPrototypeOf(t, e);
  }
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (t) {}
    return (_isNativeReflectConstruct = function () {
      return !!t;
    })();
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _possibleConstructorReturn(t, e) {
    if (e && ("object" == typeof e || "function" == typeof e)) return e;
    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t);
  }
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
      return t.__proto__ = e, t;
    }, _setPrototypeOf(t, e);
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var logger;
  var errorLogger;
  function setLogger() {
    /*eslint-disable */
    logger = console.log;
    errorLogger = console.error;
    /*eslint-enable */
  }
  function log(message) {
    if (logger) {
      for (var _len = arguments.length, optionalParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        optionalParams[_key - 1] = arguments[_key];
      }
      logger.apply(void 0, [message].concat(optionalParams));
    }
  }
  function error(message) {
    if (errorLogger) {
      for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        optionalParams[_key2 - 1] = arguments[_key2];
      }
      errorLogger.apply(void 0, [message].concat(optionalParams));
    }
  }

  function appendByteArray(buffer1, buffer2) {
    var tmp = new Uint8Array((buffer1.byteLength | 0) + (buffer2.byteLength | 0));
    tmp.set(buffer1, 0);
    tmp.set(buffer2, buffer1.byteLength | 0);
    return tmp;
  }
  function secToTime(sec) {
    var seconds,
      hours,
      minutes,
      result = '';
    seconds = Math.floor(sec);
    hours = parseInt(seconds / 3600, 10) % 24;
    minutes = parseInt(seconds / 60, 10) % 60;
    seconds = seconds < 0 ? 0 : seconds % 60;
    if (hours > 0) {
      result += (hours < 10 ? '0' + hours : hours) + ':';
    }
    result += (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    return result;
  }

  var _ExpGolomb_brand = /*#__PURE__*/new WeakSet();
  /**
   * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
  */

  var ExpGolomb = /*#__PURE__*/function () {
    function ExpGolomb(_data) {
      var ebsp2rbsp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      _classCallCheck(this, ExpGolomb);
      _classPrivateMethodInitSpec(this, _ExpGolomb_brand);
      this.data = ebsp2rbsp ? _assertClassBrand(_ExpGolomb_brand, this, _ebsp2rbsp).call(this, _data) : _data;
      this.index = 0;
      this.bitLength = _data.byteLength * 8;
    }
    return _createClass(ExpGolomb, [{
      key: "bitsAvailable",
      get: function get() {
        return this.bitLength - this.index;
      }
    }, {
      key: "skipLZ",
      value: function skipLZ() {
        var leadingZeroCount;
        for (leadingZeroCount = 0; leadingZeroCount < this.bitLength - this.index; ++leadingZeroCount) {
          if (this.getBits(1, this.index + leadingZeroCount, false) !== 0) {
            this.index += leadingZeroCount;
            return leadingZeroCount;
          }
        }
        return leadingZeroCount;
      }
    }, {
      key: "readEG",
      value: function readEG() {
        var value = this.readUEG();
        if (0x01 & value) return 1 + value >>> 1; // the number is odd if the low order bit is set, add 1 to make it even, and divide by 2
        else return -1 * (value >>> 1); // divide by two then make it negative
      }
    }, {
      key: "skipEG",
      value: function skipEG() {
        this.skipBits(1 + this.skipLZ());
      }
    }, {
      key: "getBits",
      value: function getBits(size, offsetBits) {
        var moveIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        if (this.bitsAvailable < size) return 0;
        var offset = offsetBits % 8;
        var _byte = this.data[offsetBits / 8 | 0] & 0xff >>> offset;
        var bits = 8 - offset;
        if (bits >= size) {
          if (moveIndex) this.index += size;
          return _byte >> bits - size;
        } else {
          if (moveIndex) this.index += bits;
          var nextSize = size - bits;
          return _byte << nextSize | this.getBits(nextSize, offsetBits + bits, moveIndex);
        }
      }
    }, {
      key: "readUEG",
      value: function readUEG() {
        var prefix = this.skipLZ();
        return this.readBits(prefix + 1) - 1;
      }
    }, {
      key: "setData",
      value: function setData(data) {
        this.data = data;
        this.index = 0;
        this.bitLength = data.byteLength * 8;
      }
    }, {
      key: "skipUEG",
      value: function skipUEG() {
        this.skipBits(1 + this.skipLZ());
      }
    }, {
      key: "readBits",
      value: function readBits(size) {
        var moveIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        return this.getBits(size, this.index, moveIndex);
      }
    }, {
      key: "readUInt",
      value: function readUInt() {
        return this.readBits(32);
      }
    }, {
      key: "skipBits",
      value: function skipBits(size) {
        if (this.bitsAvailable < size) return false;
        this.index += size;
      }
    }, {
      key: "readUByte",
      value: function readUByte() {
        var numberOfBytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        return this.readBits(numberOfBytes * 8);
      }
    }, {
      key: "readUShort",
      value: function readUShort() {
        return this.readBits(16);
      }
    }, {
      key: "readBoolean",
      value: function readBoolean() {
        return this.readBits(1) === 1;
      }
    }]);
  }();
  function _ebsp2rbsp(data) {
    var ret = new Uint8Array(data.byteLength);
    var retIndex = 0;
    for (var i = 0; i < data.byteLength; i++) {
      if (i >= 2) {
        if (data[i] == 0x03 && data[i - 1] == 0x00 && data[i - 2] == 0x00) {
          continue;
        }
      }
      ret[retIndex] = data[i];
      retIndex++;
    }
    return new Uint8Array(ret.buffer, 0, retIndex);
  }

  var _H265Parser_brand = /*#__PURE__*/new WeakSet();
  var H265Parser = /*#__PURE__*/function () {
    function H265Parser(remuxer) {
      _classCallCheck(this, H265Parser);
      _classPrivateMethodInitSpec(this, _H265Parser_brand);
      this.track = remuxer.mp4track;
      this.remuxer = remuxer;
      this.estimate_fps = null;
    }
    return _createClass(H265Parser, [{
      key: "readPPS",
      value: function readPPS(data) {
        var eg = new ExpGolomb(data, true);

        // remove NALu Header
        eg.readUByte();
        eg.readUByte();

        // PPS
        eg.readUEG(); // pic_parameter_set_id
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
        var cu_qp_delta_enabled_flag = eg.readBoolean();
        if (cu_qp_delta_enabled_flag) {
          eg.readUEG(); // diff_cu_qp_delta_depth
        }
        eg.readEG(); // cb_qp_offset
        eg.readEG(); // cr_qp_offset
        eg.readBoolean(); // pps_slice_chroma_qp_offsets_present_flag
        eg.readBoolean(); // weighted_pred_flag
        eg.readBoolean(); // weighted_bipred_flag
        eg.readBoolean(); // transquant_bypass_enabled_flag

        var tiles_enabled_flag = eg.readBoolean();
        var entropy_coding_sync_enabled_flag = eg.readBoolean();

        // needs hvcC
        var parallelism_type = 1; // slice-based parallel decoding
        if (entropy_coding_sync_enabled_flag && tiles_enabled_flag) parallelism_type = 0; // mixed-type parallel decoding
        else if (entropy_coding_sync_enabled_flag) parallelism_type = 3; // wavefront-based parallel decoding
        else if (tiles_enabled_flag) parallelism_type = 2; // tile-based parallel decoding

        return {
          parallelism_type: parallelism_type
        };
      }
    }, {
      key: "readSPS",
      value: function readSPS(data) {
        var eg = new ExpGolomb(data, true);

        // remove NALu Header
        eg.readUByte();
        eg.readUByte();

        // SPS
        eg.readBits(4); // video_parameter_set_id
        var sps_max_sub_layers_minus1 = eg.readBits(3);
        eg.readBoolean(); // temporal_id_nesting_flag

        // profile_tier_level begin
        var general_profile_space = eg.readBits(2);
        var general_tier_flag = eg.readBoolean();
        var general_profile_idc = eg.readBits(5);
        var general_profile_compatibility_flags = [eg.readUByte(), eg.readUByte(), eg.readUByte(), eg.readUByte()];
        var general_constraint_indicator_flags = [eg.readUByte(), eg.readUByte(), eg.readUByte(), eg.readUByte(), eg.readUByte(), eg.readUByte()];
        var general_level_idc = eg.readUByte();
        var sub_layer_profile_present_flag = [];
        var sub_layer_level_present_flag = [];
        for (var i = 0; i < sps_max_sub_layers_minus1; i++) {
          sub_layer_profile_present_flag.push(eg.readBoolean());
          sub_layer_level_present_flag.push(eg.readBoolean());
        }
        if (sps_max_sub_layers_minus1 > 0) {
          for (var _i = sps_max_sub_layers_minus1; _i < 8; _i++) {
            eg.readBits(2);
          }
        }
        for (var _i2 = 0; _i2 < sps_max_sub_layers_minus1; _i2++) {
          if (sub_layer_profile_present_flag[_i2]) {
            eg.readBits(88);
          }
          if (sub_layer_level_present_flag[_i2]) {
            eg.readUByte();
          }
        }
        // profile_tier_level end

        eg.readUEG(); // seq_parameter_set_id
        var chroma_format_idc = eg.readUEG();
        if (chroma_format_idc === 3) {
          eg.skipBits(1); // separate_colour_plane_flag
        }
        var pic_width_in_luma_samples = eg.readUEG();
        var pic_height_in_luma_samples = eg.readUEG();
        var conformance_window_flag = eg.readBoolean();
        var conf_win_left_offset = 0;
        var conf_win_right_offset = 0;
        var conf_win_top_offset = 0;
        var conf_win_bottom_offset = 0;
        if (conformance_window_flag) {
          conf_win_left_offset += eg.readUEG();
          conf_win_right_offset += eg.readUEG();
          conf_win_top_offset += eg.readUEG();
          conf_win_bottom_offset += eg.readUEG();
        }
        var bit_depth_luma_minus8 = eg.readUEG();
        var bit_depth_chroma_minus8 = eg.readUEG();
        var log_2_max_pic_order_cnt_lsb_minus4 = eg.readUEG();
        var sps_sub_layer_ordering_info_present_flag = eg.readBoolean();
        for (var _i3 = sps_sub_layer_ordering_info_present_flag ? 0 : sps_max_sub_layers_minus1; _i3 <= sps_max_sub_layers_minus1; _i3++) {
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
        var scaling_list_enabled_flag = eg.readBoolean();
        if (scaling_list_enabled_flag) {
          var sps_scaling_list_data_present_flag = eg.readBoolean();
          if (sps_scaling_list_data_present_flag) {
            for (var sizeId = 0; sizeId < 4; sizeId++) {
              for (var matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++) {
                var scaling_list_pred_mode_flag = eg.readBoolean();
                if (!scaling_list_pred_mode_flag) {
                  eg.readUEG(); // scaling_list_pred_matrix_id_delta
                } else {
                  var coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
                  if (sizeId > 1) {
                    eg.readEG();
                  }
                  for (var _i4 = 0; _i4 < coefNum; _i4++) {
                    eg.readEG();
                  }
                }
              }
            }
          }
        }
        eg.readBoolean(); // amp_enabled_flag
        eg.readBoolean(); // sample_adaptive_offset_enabled_flag

        var pcm_enabled_flag = eg.readBoolean();
        if (pcm_enabled_flag) {
          eg.readUByte();
          eg.skipUEG();
          eg.skipUEG();
          eg.readBoolean();
        }
        var num_short_term_ref_pic_sets = eg.readUEG();
        var numDeltaPocs = 0;
        for (var _i5 = 0; _i5 < num_short_term_ref_pic_sets; _i5++) {
          var inter_ref_pic_set_prediction_flag = false;
          if (_i5 !== 0) {
            inter_ref_pic_set_prediction_flag = eg.readBoolean();
          }
          if (inter_ref_pic_set_prediction_flag) {
            if (_i5 === num_short_term_ref_pic_sets) {
              eg.readUEG();
            }
            eg.readBoolean();
            eg.readUEG();
            var nextNumDeltaPocs = 0;
            for (var j = 0; j <= numDeltaPocs; j++) {
              var used_by_curr_pic_flag = eg.readBoolean();
              var use_delta_flag = false;
              if (!used_by_curr_pic_flag) {
                use_delta_flag = eg.readBoolean();
              }
              if (used_by_curr_pic_flag || use_delta_flag) {
                nextNumDeltaPocs++;
              }
            }
            numDeltaPocs = nextNumDeltaPocs;
          } else {
            var num_negative_pics = eg.readUEG();
            var num_positive_pics = eg.readUEG();
            numDeltaPocs = num_negative_pics + num_positive_pics;
            for (var _j = 0; _j < num_negative_pics; _j++) {
              eg.readUEG();
              eg.readBoolean();
            }
            for (var _j2 = 0; _j2 < num_positive_pics; _j2++) {
              eg.readUEG();
              eg.readBoolean();
            }
          }
        }
        var long_term_ref_pics_present_flag = eg.readBoolean();
        if (long_term_ref_pics_present_flag) {
          var num_long_term_ref_pics_sps = eg.readUEG();
          for (var _i6 = 0; _i6 < num_long_term_ref_pics_sps; _i6++) {
            for (var _j3 = 0; _j3 < log_2_max_pic_order_cnt_lsb_minus4 + 4; _j3++) {
              eg.readBits(1);
            }
            eg.readBits(1);
          }
        }
        var frame_field_info_present_flag = false;
        var min_spatial_segmentation_idc = 0; // for hvcC
        var default_display_window_flag = false; // for calc offset
        var fixed_pic_rate_general_flag = true;
        var vui_num_units_in_tick;
        var vui_time_scale;
        var sar_height = 1;
        var sar_width = 1;
        eg.readBoolean(); // sps_temporal_mvp_enabled_flag
        eg.readBoolean(); // strong_intra_smoothing_enabled_flag
        var vui_parameters_present_flag = eg.readBoolean();
        if (vui_parameters_present_flag) {
          var aspect_ratio_info_present_flag = eg.readBoolean();
          if (aspect_ratio_info_present_flag) {
            var aspect_ratio_idc = eg.readUByte();
            var sarWidthTable = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
            var sarHeightTable = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
            if (aspect_ratio_idc > 0 && aspect_ratio_idc <= 16) {
              sar_width = sarWidthTable[aspect_ratio_idc - 1];
              sar_height = sarHeightTable[aspect_ratio_idc - 1];
            } else if (aspect_ratio_idc === 255) {
              sar_width = eg.readBits(16);
              sar_height = eg.readBits(16);
            }
          }
          var overscan_info_present_flag = eg.readBoolean();
          if (overscan_info_present_flag) {
            eg.readBoolean();
          }
          var video_signal_type_present_flag = eg.readBoolean();
          if (video_signal_type_present_flag) {
            eg.readBits(3);
            eg.readBoolean();
            var colour_description_present_flag = eg.readBoolean();
            if (colour_description_present_flag) {
              eg.readUByte();
              eg.readUByte();
              eg.readUByte();
            }
          }
          var chroma_loc_info_present_flag = eg.readBoolean();
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
          var vui_timing_info_present_flag = eg.readBoolean();
          if (vui_timing_info_present_flag) {
            vui_num_units_in_tick = eg.readBits(32); // vui_num_units_in_tick
            vui_time_scale = eg.readBits(32); // vui_time_scale

            var vui_poc_proportional_to_timing_flag = eg.readBoolean();
            if (vui_poc_proportional_to_timing_flag) {
              eg.readUEG();
            }
            var vui_hrd_parameters_present_flag = eg.readBoolean();
            if (vui_hrd_parameters_present_flag) {
              var nal_hrd_parameters_present_flag = eg.readBoolean();
              var vcl_hrd_parameters_present_flag = eg.readBoolean();
              var sub_pic_hrd_params_present_flag = false;
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
              for (var _i7 = 0; _i7 <= sps_max_sub_layers_minus1; _i7++) {
                fixed_pic_rate_general_flag = eg.readBoolean();
                var fixed_pic_rate_within_cvs_flag = fixed_pic_rate_general_flag || eg.readBoolean();
                var low_delay_hrd_flag = false;
                if (fixed_pic_rate_within_cvs_flag) {
                  eg.readUEG();
                } else {
                  low_delay_hrd_flag = eg.readBoolean();
                }
                var cpb_cnt = low_delay_hrd_flag ? 1 : eg.readUEG() + 1;
                if (nal_hrd_parameters_present_flag) {
                  for (var _j4 = 0; _j4 < cpb_cnt; _j4++) {
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
                  for (var _j5 = 0; _j5 < cpb_cnt; _j5++) {
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
          var bitstream_restriction_flag = eg.readBoolean();
          if (bitstream_restriction_flag) {
            eg.readBoolean(); // tiles_fixed_structure_flag
            eg.readBoolean(); // motion_vectors_over_pic_boundaries_flag
            eg.readBoolean(); // restricted_ref_pic_lists_flag
            min_spatial_segmentation_idc = eg.readUEG();
          }
        }
        var width = pic_width_in_luma_samples;
        var height = pic_height_in_luma_samples;
        if (conformance_window_flag || default_display_window_flag) {
          var chroma_scale_w = 1;
          var chroma_scale_h = 1;
          if (chroma_format_idc === 1) {
            // YUV 420
            chroma_scale_w = chroma_scale_h = 2;
          } else if (chroma_format_idc === 2) {
            // YUV 422
            chroma_scale_w = 2;
          }
          width = pic_width_in_luma_samples - chroma_scale_w * conf_win_right_offset - chroma_scale_w * conf_win_left_offset;
          height = pic_height_in_luma_samples - chroma_scale_h * conf_win_bottom_offset - chroma_scale_h * conf_win_top_offset;
        }
        return {
          general_level_idc: general_level_idc,
          general_profile_space: general_profile_space,
          general_tier_flag: general_tier_flag,
          general_profile_idc: general_profile_idc,
          general_profile_compatibility_flags: general_profile_compatibility_flags,
          general_constraint_indicator_flags: general_constraint_indicator_flags,
          min_spatial_segmentation_idc: min_spatial_segmentation_idc,
          frame_field_info_present_flag: frame_field_info_present_flag,
          frame_rate: {
            fixed: fixed_pic_rate_general_flag ? 1 : 0,
            fps: vui_time_scale / vui_num_units_in_tick
          },
          chroma_format_idc: chroma_format_idc,
          bit_depth_luma_minus8: bit_depth_luma_minus8,
          bit_depth_chroma_minus8: bit_depth_chroma_minus8,
          width: width,
          height: height,
          pixelRatio: [sar_width, sar_height]
        };
      }
    }, {
      key: "readVPS",
      value: function readVPS(data) {
        var eg = new ExpGolomb(data, true);

        // remove NALu Header
        eg.readUByte();
        eg.readUByte();

        // VPS
        eg.readBits(4); // vps_video_parameter_set_id
        eg.skipBits(1); // vps_base_layer_internal_flag
        eg.skipBits(1); // vps_base_layer_available_flag
        eg.readBits(6); // vps_max_layers_minus1
        var vps_max_sub_layers_minus1 = eg.readBits(3);
        var vps_temporal_id_nesting_flag = eg.readBoolean();
        return {
          num_temporal_layers: vps_max_sub_layers_minus1 + 1,
          temporal_id_nested: vps_temporal_id_nesting_flag
        };
      }
    }, {
      key: "parseNAL",
      value: function parseNAL(unit) {
        if (!unit) return false;
        var push = false;
        var isKeyframe = false;
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
              if (!this.remuxer.readyToDecode && this.track.vps && this.track.sps && this.track.pps) this.remuxer.readyToDecode = true;
            }
            push = true;
            break;
          case H265NalUnit.NALU_TYPE_SPS_NUT:
            if (!this.track.sps) {
              this.parseSPS(unit.getPayload());
              if (!this.remuxer.readyToDecode && this.track.vps && this.track.sps && this.track.pps) this.remuxer.readyToDecode = true;
            }
            push = true;
            break;
          case H265NalUnit.NALU_TYPE_PPS_NUT:
            if (!this.track.pps) {
              this.parsePPS(unit.getPayload());
              if (!this.remuxer.readyToDecode && this.track.vps && this.track.sps && this.track.pps) this.remuxer.readyToDecode = true;
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
        if (isKeyframe) _assertClassBrand(_H265Parser_brand, this, _estimateFPS).call(this);
        return push;
      }
    }, {
      key: "parsePPS",
      value: function parsePPS(data) {
        var pps = new Uint8Array(data);
        var config = this.readPPS(pps);
        this.track.pps = [pps];
        this.track.params = Object.assign(this.track.params, config);
      }
    }, {
      key: "parseSEI",
      value: function parseSEI(unit) {
        console.log("parseSEI - unit type=".concat(unit.getType(), " payloadSize=").concat(unit.getPayloadSize()));
        var data = _assertClassBrand(_H265Parser_brand, this, _discardEPB).call(this, unit.getPayload());
        var offset = 0;
        while (offset < data.length) {
          var payloadType = 0;
          var payloadSize = 0;
          while (offset < data.length) {
            var _byte = data[offset++];
            payloadType += _byte;
            if (_byte !== 0xff) break;
          }
          while (offset < data.length) {
            var _byte2 = data[offset++];
            payloadSize += _byte2;
            if (_byte2 !== 0xff) break;
          }
          if (offset + payloadSize > data.length) {
            console.log("parseSEI - invalid SEI size (payloadType=".concat(payloadType, ", payloadSize=").concat(payloadSize, ", data.length=").concat(data.length, ")"));
            break;
          }
          var payloadData = data.subarray(offset, offset + payloadSize);
          console.log("parseSEI - payloadType=".concat(payloadType, ", payloadSize=").concat(payloadSize, ", payloadData"), payloadData);
          offset += payloadSize;
        }
      }
    }, {
      key: "parseSPS",
      value: function parseSPS(data) {
        var sps = new Uint8Array(data);
        var config = this.readSPS(sps);
        this.track.sps = [sps];
        this.track.params = Object.assign(this.track.params, config);
        var profile_space_string = config.general_profile_space ? ['A', 'B', 'C'][config.general_profile_space] : '';
        var profile_compatibility_buf = config.general_profile_compatibility_flags[0] << 24 | config.general_profile_compatibility_flags[1] << 16 | config.general_profile_compatibility_flags[2] << 8 | config.general_profile_compatibility_flags[3];
        var profile_compatibility_rev = 0;
        for (var i = 0; i < 32; i++) {
          profile_compatibility_rev = (profile_compatibility_rev | (profile_compatibility_buf >> i & 1) << 31 - i) >>> 0; // reverse bit position (and cast as UInt32)
        }
        var profile_compatibility_flags_string = profile_compatibility_rev.toString(16);
        if (config.general_profile_idc === 1 && profile_compatibility_flags_string === '2') {
          profile_compatibility_flags_string = '6';
        }
        var tier_flag_string = config.general_tier_flag ? 'H' : 'L';
        this.track.fps = config.frame_rate.fps || this.track.fps;
        this.track.codec = "hvc1.".concat(profile_space_string).concat(config.general_profile_idc, ".").concat(profile_compatibility_flags_string, ".").concat(tier_flag_string).concat(config.general_level_idc, ".B0");
        this.track.width = config.width;
        this.track.height = config.height;
        this.track.segmentCodec = 'hevc';
      }
    }, {
      key: "parseVPS",
      value: function parseVPS(data) {
        var vps = new Uint8Array(data);
        var config = this.readVPS(vps);
        this.track.vps = [vps];
        this.track.params = Object.assign(this.track.params, config);
      }
    }]);
  }();
  function _discardEPB(data) {
    var length = data.byteLength;
    var EPBPositions = [];
    var i = 1;

    // Find all `Emulation Prevention Bytes`
    while (i < length - 2) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
        EPBPositions.push(i + 2);
        i += 2;
      } else {
        i++;
      }
    }

    // If no Emulation Prevention Bytes were found just return the original array
    if (EPBPositions.length === 0) return data;

    // Create a new array to hold the NAL unit data
    var newLength = length - EPBPositions.length;
    var newData = new Uint8Array(newLength);
    var sourceIndex = 0;
    for (i = 0; i < newLength; sourceIndex++, i++) {
      if (sourceIndex === EPBPositions[0]) {
        // Skip this byte
        sourceIndex++;
        // Remove this position index
        EPBPositions.shift();
      }
      newData[i] = data[sourceIndex];
    }
    return newData;
  }
  function _estimateFPS() {
    if (this.estimate_fps === null) {
      this.estimate_fps = {
        fps: 0,
        perf: performance.now(),
        frames: 0
      };
    }
    this.estimate_fps.frames++;
    if (this.estimate_fps.frames > 1) this.estimate_fps.fps = Math.round((performance.now() - this.estimate_fps.perf) / this.estimate_fps.frames / 1000, 2);
    if (this.estimate_fps.fps > 0 && this.track.fps !== this.estimate_fps.fps) this.track.fps = this.estimate_fps.fps;
    console.log("H265Parser: estimateFPS fps=".concat(this.estimate_fps.fps, " (fps=").concat(this.track.fps, ")"));
  }
  var H265NalUnit = /*#__PURE__*/function () {
    function H265NalUnit(data) {
      _classCallCheck(this, H265NalUnit);
      this.type = data[0] >> 1 & 0x3f;
      this.isvcl = this.type >= H265NalUnit.NALU_TYPE_TRAIL_N && this.type <= H265NalUnit.NALU_TYPE_RSV_VCL31;
      this.payload = data;
    }
    return _createClass(H265NalUnit, [{
      key: "getData",
      value: function getData() {
        var result = new Uint8Array(this.getSize());
        var view = new DataView(result.buffer);
        view.setUint32(0, this.getSize() - 4);
        result.set(this.getPayload(), 4);
        return result;
      }
    }, {
      key: "getSize",
      value: function getSize() {
        return 4 + this.getPayloadSize();
      }
    }, {
      key: "getType",
      value: function getType() {
        return this.type;
      }
    }, {
      key: "initParser",
      value: function initParser(remuxer) {
        return new H265Parser(remuxer);
      }
    }, {
      key: "getPayload",
      value: function getPayload() {
        return this.payload;
      }
    }, {
      key: "isKeyframe",
      value: function isKeyframe() {
        return this.type === H265NalUnit.NALU_TYPE_IDR_W_RADL || this.type === H265NalUnit.NALU_TYPE_IDR_N_LP || this.type === H265NalUnit.NALU_TYPE_CRA_NUT;
      }
    }, {
      key: "getPayloadSize",
      value: function getPayloadSize() {
        return this.payload.byteLength;
      }
    }]);
  }();
  _defineProperty(H265NalUnit, "NALU_TYPE_TRAIL_N", 0x00);
  _defineProperty(H265NalUnit, "NALU_TYPE_TRAIL_R", 0x01);
  _defineProperty(H265NalUnit, "NALU_TYPE_TSA_N", 0x02);
  _defineProperty(H265NalUnit, "NALU_TYPE_TSA_R", 0x03);
  _defineProperty(H265NalUnit, "NALU_TYPE_STSA_N", 0x04);
  _defineProperty(H265NalUnit, "NALU_TYPE_STSA_R", 0x05);
  _defineProperty(H265NalUnit, "NALU_TYPE_RADL_N", 0x06);
  _defineProperty(H265NalUnit, "NALU_TYPE_RADL_R", 0x07);
  _defineProperty(H265NalUnit, "NALU_TYPE_RASL_N", 0x08);
  _defineProperty(H265NalUnit, "NALU_TYPE_RASL_R", 0x09);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL_N10", 0x0a);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL_N12", 0x0b);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL_N14", 0x0c);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL_R11", 0x0d);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL_R13", 0x0e);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL_R15", 0x0f);
  _defineProperty(H265NalUnit, "NALU_TYPE_BLA_W_LP", 0x10);
  _defineProperty(H265NalUnit, "NALU_TYPE_BLA_W_RADL", 0x11);
  _defineProperty(H265NalUnit, "NALU_TYPE_BLA_N_LP", 0x12);
  _defineProperty(H265NalUnit, "NALU_TYPE_IDR_W_RADL", 0x13);
  _defineProperty(H265NalUnit, "NALU_TYPE_IDR_N_LP", 0x14);
  _defineProperty(H265NalUnit, "NALU_TYPE_CRA_NUT", 0x15);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_IRAP_VCL22", 0x16);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_IRAP_VCL23", 0x17);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL24", 0x18);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL25", 0x19);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL26", 0x1a);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL27", 0x1b);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL28", 0x1c);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL29", 0x1d);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL30", 0x1e);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_VCL31", 0x1f);
  _defineProperty(H265NalUnit, "NALU_TYPE_VPS_NUT", 0x20);
  _defineProperty(H265NalUnit, "NALU_TYPE_SPS_NUT", 0x21);
  _defineProperty(H265NalUnit, "NALU_TYPE_PPS_NUT", 0x22);
  _defineProperty(H265NalUnit, "NALU_TYPE_AUD_NUT", 0x23);
  _defineProperty(H265NalUnit, "NALU_TYPE_EOS_NUT", 0x24);
  _defineProperty(H265NalUnit, "NALU_TYPE_EOB_NUT", 0x25);
  _defineProperty(H265NalUnit, "NALU_TYPE_FD_NUT", 0x26);
  _defineProperty(H265NalUnit, "NALU_TYPE_SEI_PREFIX", 0x27);
  _defineProperty(H265NalUnit, "NALU_TYPE_SEI_SUFFIX", 0x28);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL41", 0x29);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL42", 0x2a);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL43", 0x2b);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL44", 0x2c);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL45", 0x2d);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL46", 0x2e);
  _defineProperty(H265NalUnit, "NALU_TYPE_RSV_NVCL47", 0x2f);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC48", 0x30);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC49", 0x31);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC50", 0x32);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC51", 0x33);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC52", 0x34);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC53", 0x35);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC54", 0x36);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC55", 0x37);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC56", 0x38);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC57", 0x39);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC58", 0x3a);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC59", 0x3b);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC60", 0x3c);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC61", 0x3d);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC62", 0x3e);
  _defineProperty(H265NalUnit, "NALU_TYPE_UNSPEC63", 0x3f);

  var _profilesWithOptionalSPSData = /*#__PURE__*/new WeakMap();
  var _H264Parser_brand = /*#__PURE__*/new WeakSet();
  var H264Parser = /*#__PURE__*/function () {
    function H264Parser(remuxer) {
      _classCallCheck(this, H264Parser);
      _classPrivateMethodInitSpec(this, _H264Parser_brand);
      _classPrivateFieldInitSpec(this, _profilesWithOptionalSPSData, [100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134]);
      this.track = remuxer.mp4track;
      this.remuxer = remuxer;
    }
    return _createClass(H264Parser, [{
      key: "readSPS",
      value: function readSPS(data) {
        var eg = new ExpGolomb(data);
        var readUByte = eg.readUByte.bind(eg);
        var readUInt = eg.readUInt.bind(eg);
        var readBits = eg.readBits.bind(eg);
        var readUEG = eg.readUEG.bind(eg);
        var readBoolean = eg.readBoolean.bind(eg);
        var skipBits = eg.skipBits.bind(eg);
        var skipEG = eg.skipEG.bind(eg);
        var skipUEG = eg.skipUEG.bind(eg);
        var skipScalingList = _assertClassBrand(_H264Parser_brand, this, _skipScalingList).bind(this);
        var frameCropLeftOffset = 0;
        var frameCropRightOffset = 0;
        var frameCropTopOffset = 0;
        var frameCropBottomOffset = 0;
        var numRefFramesInPicOrderCntCycle;
        var scalingListCount;
        var i;
        var calcFps;
        readUByte();
        var profileIdc = readUByte(); // profile_idc u(8)
        readUByte(); // constraint_set[0-5]_flag
        readUByte(); // level_idc u(8)
        skipUEG(); // seq_parameter_set_id

        // some profiles have more optional data we don't need
        if (_classPrivateFieldGet2(_profilesWithOptionalSPSData, this).indexOf(profileIdc) >= 0) {
          var chromaFormatIdc = readUEG();
          if (chromaFormatIdc === 3) {
            skipBits(1);
          } // separate_colour_plane_flag

          skipUEG(); // bit_depth_luma_minus8
          skipUEG(); // bit_depth_chroma_minus8
          skipBits(1); // qpprime_y_zero_transform_bypass_flag

          if (readBoolean()) {
            // seq_scaling_matrix_present_flag
            scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;
            for (i = 0; i < scalingListCount; i++) {
              if (readBoolean()) {
                // seq_scaling_list_present_flag[ i ]
                if (i < 6) skipScalingList(16, eg);else skipScalingList(64, eg);
              }
            }
          }
        }
        skipUEG(); // log2_max_frame_num_minus4

        var picOrderCntType = readUEG();
        if (picOrderCntType === 0) {
          readUEG(); // log2_max_pic_order_cnt_lsb_minus4
        } else if (picOrderCntType === 1) {
          skipBits(1); // delta_pic_order_always_zero_flag
          skipEG(); // offset_for_non_ref_pic
          skipEG(); // offset_for_top_to_bottom_field

          numRefFramesInPicOrderCntCycle = readUEG();
          for (i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
            skipEG();
          } // offset_for_ref_frame[ i ]
        }
        skipUEG(); // max_num_ref_frames
        skipBits(1); // gaps_in_frame_num_value_allowed_flag

        var picWidthInMbsMinus1 = readUEG();
        var picHeightInMapUnitsMinus1 = readUEG();
        var frameMbsOnlyFlag = readBits(1);
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
        var pixelRatio = [1, 1];
        if (readBoolean()) {
          // vui_parameters_present_flag

          if (readBoolean()) {
            // aspect_ratio_info_present_flag
            var aspectRatioIdc = readUByte();
            var pixelRatioTable = [[1, 1], [12, 11], [10, 11], [16, 11], [40, 33], [24, 11], [20, 11], [32, 11], [80, 33], [18, 11], [15, 11], [64, 33], [160, 99], [4, 3], [3, 2], [2, 1]];
            if (aspectRatioIdc > 0 && aspectRatioIdc <= 16) {
              pixelRatio = pixelRatioTable[aspectRatioIdc - 1];
            } else if (aspectRatioIdc === 255) {
              pixelRatio = [readUByte() << 8 | readUByte(), readUByte() << 8 | readUByte()];
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
            var numUnitsInTick = readUInt();
            var timeScale = readUInt();
            var fixedFrameRateFlag = readBoolean();
            var frameDuration = timeScale / (2 * numUnitsInTick);
            if (fixedFrameRateFlag) calcFps = frameDuration;
          }
        }
        return {
          fps: calcFps,
          width: Math.ceil((picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2),
          height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - (frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset),
          pixelRatio: pixelRatio
        };
      }
    }, {
      key: "parseNAL",
      value: function parseNAL(unit) {
        if (!unit) return false;
        var push = false;
        switch (unit.getType()) {
          case H264NalUnit.NALU_TYPE_NDR:
          case H264NalUnit.NALU_TYPE_IDR:
            push = true;
            break;
          case H264NalUnit.NALU_TYPE_PPS:
            if (!this.track.pps) {
              this.parsePPS(unit.getPayload());
              if (!this.remuxer.readyToDecode && this.track.sps && this.track.pps) this.remuxer.readyToDecode = true;
            }
            push = true;
            break;
          case H264NalUnit.NALU_TYPE_SPS:
            if (!this.track.sps) {
              this.parseSPS(unit.getPayload());
              if (!this.remuxer.readyToDecode && this.track.sps && this.track.pps) this.remuxer.readyToDecode = true;
            }
            push = true;
            break;
          default:
            console.log('H264Parser: unsupported NAL type!', unit.getType());
        }
        return push;
      }
    }, {
      key: "parsePPS",
      value: function parsePPS(data) {
        this.track.pps = [new Uint8Array(data)];
      }
    }, {
      key: "parseSPS",
      value: function parseSPS(data) {
        var sps = new Uint8Array(data);
        var config = this.readSPS(sps);
        this.track.fps = config.fps;
        this.track.sps = [sps];
        this.track.codec = 'avc1.';
        this.track.width = config.width;
        this.track.height = config.height;
        this.track.segmentCodec = 'avc';
        var codecarray = sps.subarray(1, 4);
        for (var i = 0; i < 3; i++) {
          var h = codecarray[i].toString(16);
          if (h.length < 2) h = '0' + h;
          this.track.codec += h;
        }
      }
    }]);
  }();
  function _skipScalingList(count, reader) {
    var lastScale = 8;
    var nextScale = 8;
    var deltaScale;
    for (var j = 0; j < count; j++) {
      if (nextScale !== 0) {
        deltaScale = reader.readEG();
        nextScale = (lastScale + deltaScale + 256) % 256;
      }
      lastScale = nextScale === 0 ? lastScale : nextScale;
    }
  }
  var _H264NalUnit_brand = /*#__PURE__*/new WeakSet();
  var H264NalUnit = /*#__PURE__*/function () {
    function H264NalUnit(data) {
      _classCallCheck(this, H264NalUnit);
      _classPrivateMethodInitSpec(this, _H264NalUnit_brand);
      this.type = data[0] & 0x1f;
      this.isfmb = false;
      this.isvcl = this.type === H264NalUnit.NALU_TYPE_NDR || this.type === H264NalUnit.NALU_TYPE_IDR;
      this.stype = undefined;
      this.payload = data;
      if (this.isvcl) _assertClassBrand(_H264NalUnit_brand, this, _parseHeader).call(this);
    }
    return _createClass(H264NalUnit, [{
      key: "getData",
      value: function getData() {
        var result = new Uint8Array(this.getSize());
        var view = new DataView(result.buffer);
        view.setUint32(0, this.getSize() - 4);
        result.set(this.getPayload(), 4);
        return result;
      }
    }, {
      key: "getSize",
      value: function getSize() {
        return 4 + this.getPayloadSize();
      }
    }, {
      key: "getType",
      value: function getType() {
        return this.type;
      }
    }, {
      key: "initParser",
      value: function initParser(remuxer) {
        return new H264Parser(remuxer);
      }
    }, {
      key: "getPayload",
      value: function getPayload() {
        return this.payload;
      }
    }, {
      key: "isKeyframe",
      value: function isKeyframe() {
        return this.type === H264NalUnit.NALU_TYPE_IDR;
      }
    }, {
      key: "getPayloadSize",
      value: function getPayloadSize() {
        return this.payload.byteLength;
      }
    }]);
  }();
  function _parseHeader() {
    var eg = new ExpGolomb(this.payload);

    // skip NALu type
    eg.readUByte();
    this.isfmb = eg.readUEG() === 0; // first_mb_in_slice
    this.stype = eg.readUEG(); // slice_type
  }
  _defineProperty(H264NalUnit, "NALU_TYPE_NDR", 0x01);
  _defineProperty(H264NalUnit, "NALU_TYPE_IDR", 0x05);
  _defineProperty(H264NalUnit, "NALU_TYPE_SEI", 0x06);
  _defineProperty(H264NalUnit, "NALU_TYPE_SPS", 0x07);
  _defineProperty(H264NalUnit, "NALU_TYPE_PPS", 0x08);
  _defineProperty(H264NalUnit, "NALU_TYPE_AUD", 0x09);
  _defineProperty(H264NalUnit, "NALU_TYPE_FILLER_DATA", 0x0c);

  var AACParser = /*#__PURE__*/function () {
    function AACParser(remuxer) {
      _classCallCheck(this, AACParser);
      this.remuxer = remuxer;
      this.track = remuxer.mp4track;
    }
    return _createClass(AACParser, [{
      key: "setAACConfig",
      value: function setAACConfig() {
        var objectType,
          sampleIndex,
          channelCount,
          config = new Uint8Array(2),
          headerData = AACParser.aacHeader;
        if (!headerData) return;
        objectType = ((headerData[2] & 0xC0) >>> 6) + 1;
        sampleIndex = (headerData[2] & 0x3C) >>> 2;
        channelCount = (headerData[2] & 0x01) << 2;
        channelCount |= (headerData[3] & 0xC0) >>> 6;

        /* refer to http://wiki.multimedia.cx/index.php?title=MPEG-4_Audio#Audio_Specific_Config */
        config[0] = objectType << 3;
        config[0] |= (sampleIndex & 0x0E) >> 1;
        config[1] |= (sampleIndex & 0x01) << 7;
        config[1] |= channelCount << 3;
        this.track.codec = 'mp4a.40.' + objectType;
        this.track.segmentCodec = 'aac';
        this.track.channelCount = channelCount;
        this.track.config = config;
        this.remuxer.readyToDecode = true;
      }
    }], [{
      key: "samplingRateMap",
      get: function get() {
        return [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
      }
    }, {
      key: "getHeaderLength",
      value: function getHeaderLength(data) {
        return data[1] & 0x01 ? 7 : 9; // without CRC 7 and with CRC 9 Refs: https://wiki.multimedia.cx/index.php?title=ADTS
      }
    }, {
      key: "getFrameLength",
      value: function getFrameLength(data) {
        return (data[3] & 0x03) << 11 | data[4] << 3 | (data[5] & 0xE0) >>> 5; // 13 bits length ref: https://wiki.multimedia.cx/index.php?title=ADTS
      }
    }, {
      key: "isAACPattern",
      value: function isAACPattern(data) {
        return data[0] === 0xff && (data[1] & 0xf0) === 0xf0 && (data[1] & 0x06) === 0x00;
      }
    }, {
      key: "extractAAC",
      value: function extractAAC(buffer) {
        var i = 0,
          length = buffer.byteLength,
          result = [],
          headerLength,
          frameLength;
        if (!AACParser.isAACPattern(buffer)) {
          error('Invalid ADTS audio format');
          return result;
        }
        headerLength = AACParser.getHeaderLength(buffer);
        if (!AACParser.aacHeader) {
          AACParser.aacHeader = buffer.subarray(0, headerLength);
        }
        while (i < length) {
          frameLength = AACParser.getFrameLength(buffer);
          result.push(buffer.subarray(headerLength, frameLength));
          buffer = buffer.slice(frameLength);
          i += frameLength;
        }
        return result;
      }
    }]);
  }();
  _defineProperty(AACParser, "aacHeader", void 0);

  var Event = /*#__PURE__*/function () {
    function Event(type) {
      _classCallCheck(this, Event);
      this.listener = {};
      this.type = type | '';
    }
    return _createClass(Event, [{
      key: "on",
      value: function on(event, fn) {
        if (!this.listener[event]) this.listener[event] = [];
        this.listener[event].push(fn);
        return true;
      }
    }, {
      key: "off",
      value: function off(event, fn) {
        if (this.listener[event]) {
          var index = this.listener[event].indexOf(fn);
          if (index > -1) this.listener[event].splice(index, 1);
          return true;
        }
        return false;
      }
    }, {
      key: "offAll",
      value: function offAll() {
        this.listener = {};
      }
    }, {
      key: "dispatch",
      value: function dispatch(event, data) {
        if (this.listener[event]) {
          this.listener[event].map(function (each) {
            each.apply(null, [data]);
          });
          return true;
        }
        return false;
      }
    }]);
  }();

  /**
   * Generate MP4 Box
   * taken from: https://github.com/dailymotion/hls.js
   */

  var MP4 = /*#__PURE__*/function () {
    function MP4() {
      _classCallCheck(this, MP4);
    }
    return _createClass(MP4, null, [{
      key: "UINT32_MAX",
      get: function get() {
        return Math.pow(2, 32) - 1;
      }
    }, {
      key: "USE_M2TS_ADVANCED_CODECS",
      get: function get() {
        return true;
      }
    }, {
      key: "init",
      value: function init() {
        MP4.types = {
          avc1: [],
          // codingname
          avcC: [],
          hvc1: [],
          hvcC: [],
          btrt: [],
          dinf: [],
          dref: [],
          esds: [],
          ftyp: [],
          hdlr: [],
          mdat: [],
          mdhd: [],
          mdia: [],
          mfhd: [],
          minf: [],
          moof: [],
          moov: [],
          mp4a: [],
          '.mp3': [],
          dac3: [],
          'ac-3': [],
          mvex: [],
          mvhd: [],
          pasp: [],
          sdtp: [],
          stbl: [],
          stco: [],
          stsc: [],
          stsd: [],
          stsz: [],
          stts: [],
          tfdt: [],
          tfhd: [],
          traf: [],
          trak: [],
          trun: [],
          trex: [],
          tkhd: [],
          vmhd: [],
          smhd: []
        };
        var i;
        for (i in MP4.types) {
          if (MP4.types.hasOwnProperty(i)) {
            MP4.types[i] = [i.charCodeAt(0), i.charCodeAt(1), i.charCodeAt(2), i.charCodeAt(3)];
          }
        }
        var videoHdlr = new Uint8Array([0x00,
        // version 0
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x00,
        // pre_defined
        0x76, 0x69, 0x64, 0x65,
        // handler_type: 'vide'
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
        ]);
        var audioHdlr = new Uint8Array([0x00,
        // version 0
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x00,
        // pre_defined
        0x73, 0x6f, 0x75, 0x6e,
        // handler_type: 'soun'
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
        ]);
        MP4.HDLR_TYPES = {
          video: videoHdlr,
          audio: audioHdlr
        };
        var dref = new Uint8Array([0x00,
        // version 0
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x01,
        // entry_count
        0x00, 0x00, 0x00, 0x0c,
        // entry_size
        0x75, 0x72, 0x6c, 0x20,
        // 'url' type
        0x00,
        // version 0
        0x00, 0x00, 0x01 // entry_flags
        ]);
        var stco = new Uint8Array([0x00,
        // version
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x00 // entry_count
        ]);
        MP4.STTS = MP4.STSC = MP4.STCO = stco;
        MP4.STSZ = new Uint8Array([0x00,
        // version
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x00,
        // sample_size
        0x00, 0x00, 0x00, 0x00 // sample_count
        ]);
        MP4.VMHD = new Uint8Array([0x00,
        // version
        0x00, 0x00, 0x01,
        // flags
        0x00, 0x00,
        // graphicsmode
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // opcolor
        ]);
        MP4.SMHD = new Uint8Array([0x00,
        // version
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00,
        // balance
        0x00, 0x00 // reserved
        ]);
        MP4.STSD = new Uint8Array([0x00,
        // version 0
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x01]); // entry_count

        var majorBrand = new Uint8Array([105, 115, 111, 109]); // isom
        var avc1Brand = new Uint8Array([97, 118, 99, 49]); // avc1
        var minorVersion = new Uint8Array([0, 0, 0, 1]);
        MP4.FTYP = MP4.box(MP4.types.ftyp, majorBrand, minorVersion, majorBrand, avc1Brand);
        MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
      }
    }, {
      key: "box",
      value: function box(type) {
        var size = 8;
        for (var _len = arguments.length, payload = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          payload[_key - 1] = arguments[_key];
        }
        var i = payload.length;
        var len = i;

        // calculate the total size we need to allocate
        while (i--) size += payload[i].byteLength;
        var result = new Uint8Array(size);
        result.set(MP4.breakNumberIntoBytes(size, 4));
        result.set(type, 4);

        // copy the payload into the result
        for (i = 0, size = 8; i < len; ++i) {
          // copy payload[i] array @ offset size
          result.set(payload[i], size);
          size += payload[i].byteLength;
        }
        return result;
      }
    }, {
      key: "hdlr",
      value: function hdlr(type) {
        return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
      }
    }, {
      key: "mdat",
      value: function mdat(data) {
        return MP4.box(MP4.types.mdat, data);
      }
    }, {
      key: "mdhd",
      value: function mdhd(timescale, duration) {
        //duration *= timescale;
        var upperWordDuration = Math.floor(duration / (MP4.UINT32_MAX + 1));
        var lowerWordDuration = Math.floor(duration % (MP4.UINT32_MAX + 1));
        return MP4.box(MP4.types.mdhd, new Uint8Array([0x01,
        // version 1
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
        // creation_time
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03].concat(_toConsumableArray(MP4.breakNumberIntoBytes(timescale, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(upperWordDuration, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(lowerWordDuration, 4)), [0x55, 0xc4,
        // 'und' language (undetermined)
        0x00, 0x00])));
      }
    }, {
      key: "mdia",
      value: function mdia(track) {
        console.log('mdia', track);
        return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale || 0, track.duration || 0), MP4.hdlr(track.type), MP4.minf(track));
      }
    }, {
      key: "mfhd",
      value: function mfhd(sequenceNumber) {
        return MP4.box(MP4.types.mfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(sequenceNumber, 4)))));
      }
    }, {
      key: "minf",
      value: function minf(track) {
        console.log('minf', track);
        if (track.type === 'audio') {
          return MP4.box(MP4.types.minf, MP4.box(MP4.types.smhd, MP4.SMHD), MP4.DINF, MP4.stbl(track));
        } else {
          return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
        }
      }
    }, {
      key: "moof",
      value: function moof(sn, baseMediaDecodeTime, track) {
        return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
      }
    }, {
      key: "moov",
      value: function moov(tracks) {
        var i = tracks.length,
          boxes = [];
        while (i--) {
          boxes[i] = MP4.trak(tracks[i]);
        }
        return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(tracks[0].timescale || 0, tracks[0].duration || 0)].concat(boxes).concat(MP4.mvex(tracks)));
      }
    }, {
      key: "mvex",
      value: function mvex(tracks) {
        var i = tracks.length,
          boxes = [];
        while (i--) {
          boxes[i] = MP4.trex(tracks[i]);
        }
        return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
      }
    }, {
      key: "mvhd",
      value: function mvhd(timescale, duration) {
        //duration *= timescale;
        var upperWordDuration = Math.floor(duration / (MP4.UINT32_MAX + 1));
        var lowerWordDuration = Math.floor(duration % (MP4.UINT32_MAX + 1));
        return MP4.box(MP4.types.mvhd, new Uint8Array([0x01,
        // version 1
        0x00, 0x00, 0x00,
        // flags
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
        // creation_time
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03].concat(_toConsumableArray(MP4.breakNumberIntoBytes(timescale, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(upperWordDuration, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(lowerWordDuration, 4)), [0x00, 0x01, 0x00, 0x00,
        // 1.0 rate
        0x01, 0x00,
        // 1.0 volume
        0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00,
        // transformation: unity matrix
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // pre_defined
        0xff, 0xff, 0xff, 0xff // next_track_ID
        ])));
      }
    }, {
      key: "sdtp",
      value: function sdtp(track) {
        var samples = track.samples || [],
          bytes = new Uint8Array(4 + samples.length),
          flags,
          i;

        // leave the full box header (4 bytes) all zero
        // write the sample table
        for (i = 0; i < samples.length; i++) {
          flags = samples[i].flags;
          bytes[i + 4] = flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
        }
        return MP4.box(MP4.types.sdtp, bytes);
      }
    }, {
      key: "stbl",
      value: function stbl(track) {
        console.log('stbl', track);
        return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
      }
    }, {
      key: "avc1",
      value: function avc1(track) {
        var sps = [],
          pps = [],
          i,
          data,
          len;

        // assemble the SPSs
        for (i = 0; i < track.sps.length; i++) {
          data = track.sps[i];
          len = data.byteLength;
          sps.push(len >>> 8 & 0xFF);
          sps.push(len & 0xFF);
          sps = sps.concat(Array.prototype.slice.call(data)); // SPS
        }

        // assemble the PPSs
        for (i = 0; i < track.pps.length; i++) {
          data = track.pps[i];
          len = data.byteLength;
          pps.push(len >>> 8 & 0xFF);
          pps.push(len & 0xFF);
          pps = pps.concat(Array.prototype.slice.call(data));
        }
        var avcc = MP4.box(MP4.types.avcC, new Uint8Array([0x01,
        // version
        sps[3],
        // profile
        sps[4],
        // profile compat
        sps[5],
        // level
        0xfc | 3,
        // lengthSizeMinusOne, hard-coded to 4 bytes
        0xE0 | track.sps.length // 3bit reserved (111) + numOfSequenceParameterSets
        ].concat(sps).concat([track.pps.length // numOfPictureParameterSets
        ]).concat(pps))); // "PPS"

        var width = track.width;
        var height = track.height;
        var hSpacing = track.pixelRatio[0];
        var vSpacing = track.pixelRatio[1];
        return MP4.box(MP4.types.avc1, new Uint8Array([0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00,
        // reserved
        0x00, 0x01,
        // data_reference_index
        0x00, 0x00,
        // pre_defined
        0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(width, 2)), _toConsumableArray(MP4.breakNumberIntoBytes(height, 2)), [
        // height
        0x00, 0x48, 0x00, 0x00,
        // horizresolution
        0x00, 0x48, 0x00, 0x00,
        // vertresolution
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x01,
        // frame_count
        0x09, 0x6a, 0x6d, 0x75, 0x78,
        // jmuxer.js
        0x65, 0x72, 0x2e, 0x6a, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // compressorname
        0x18,
        // depth = 24
        0x11, 0x11 // pre_defined = -1
        ])), avcc, MP4.box(MP4.types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80,
        // bufferSizeDB
        0x00, 0x2d, 0xc6, 0xc0,
        // maxBitrate
        0x00, 0x2d, 0xc6, 0xc0 // avgBitrate
        ])), MP4.box(MP4.types.pasp, new Uint8Array([].concat(_toConsumableArray(MP4.breakNumberIntoBytes(hSpacing, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(vSpacing, 4))))));
      }

      /* TO FIX! */
    }, {
      key: "esds",
      value: function esds(track) {
        var configlen = track.config.byteLength;
        var data = new Uint8Array(26 + configlen + 3);
        data.set([0x00,
        // version 0
        0x00, 0x00, 0x00,
        // flags

        0x03,
        // descriptor_type
        0x17 + configlen,
        // length
        0x00, 0x01,
        // es_id
        0x00,
        // stream_priority

        0x04,
        // descriptor_type
        0x0f + configlen,
        // length
        0x40,
        // codec : mpeg4_audio
        0x15,
        // stream_type
        0x00, 0x00, 0x00,
        // buffer_size
        0x00, 0x00, 0x00, 0x00,
        // maxBitrate
        0x00, 0x00, 0x00, 0x00,
        // avgBitrate

        0x05,
        // descriptor_type
        configlen]);
        data.set(track.config, 26);
        data.set([0x06, 0x01, 0x02], 26 + configlen);
        return data;
      }
    }, {
      key: "audioStsd",
      value: function audioStsd(track) {
        var samplerate = track.samplerate || 0;
        return new Uint8Array([0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00,
        // reserved
        0x00, 0x01,
        // data_reference_index
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, track.channelCount || 0,
        // channelcount
        0x00, 0x10,
        // sampleSize:16bits
        0x00, 0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(samplerate, 2)), [
        // samplerate
        0x00, 0x00]));
      }
    }, {
      key: "mp4a",
      value: function mp4a(track) {
        return MP4.box(MP4.types.mp4a, MP4.audioStsd(track), MP4.box(MP4.types.esds, MP4.esds(track)));
      }
    }, {
      key: "mp3",
      value: function mp3(track) {
        return MP4.box(MP4.types['.mp3'], MP4.audioStsd(track));
      }
    }, {
      key: "ac3",
      value: function ac3(track) {
        return MP4.box(MP4.types['ac-3'], MP4.audioStsd(track), MP4.box(MP4.types.dac3, new Uint8Array(track.config)));
      }
    }, {
      key: "stsd",
      value: function stsd(track) {
        console.log('stsd', track);
        var segmentCodec = track.segmentCodec;
        if (track.type === 'audio') {
          if (segmentCodec === 'aac') {
            return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp4a(track));
          }
          if (MP4.USE_M2TS_ADVANCED_CODECS && segmentCodec === 'ac3' && track.config) {
            return MP4.box(MP4.types.stsd, MP4.STSD, MP4.ac3(track));
          }
          if (segmentCodec === 'mp3' && track.codec === 'mp3') {
            return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp3(track));
          }
        } else {
          if (track.pps && track.sps) {
            if (segmentCodec === 'avc') {
              return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
            }
            if (MP4.USE_M2TS_ADVANCED_CODECS && segmentCodec === 'hevc' && track.vps) {
              return MP4.box(MP4.types.stsd, MP4.STSD, MP4.hvc1(track));
            }
          } else {
            throw new Error("video track missing pps or sps");
          }
        }
        throw new Error("unsupported ".concat(track.type, " segment codec (").concat(segmentCodec, "/").concat(track.codec, ")"));
      }
    }, {
      key: "tkhd",
      value: function tkhd(track) {
        var id = track.id;
        var width = track.width || 0;
        var height = track.height || 0;
        var duration = (track.duration || 0) * (track.timescale || 0);
        var upperWordDuration = Math.floor(duration / (MP4.UINT32_MAX + 1));
        var lowerWordDuration = Math.floor(duration % (MP4.UINT32_MAX + 1));
        return MP4.box(MP4.types.tkhd, new Uint8Array([0x01,
        // version 1
        0x00, 0x00, 0x07,
        // flags
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
        // creation_time
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03].concat(_toConsumableArray(MP4.breakNumberIntoBytes(id, 4)), [
        // track_ID
        0x00, 0x00, 0x00, 0x00], _toConsumableArray(MP4.breakNumberIntoBytes(upperWordDuration, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(lowerWordDuration, 4)), [
        // duration
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00,
        // layer
        0x00, 0x00,
        // alternate_group
        0x00, 0x00,
        // non-audio track volume
        0x00, 0x00,
        // reserved
        0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00], _toConsumableArray(MP4.breakNumberIntoBytes(width, 2)), [0x00, 0x00], _toConsumableArray(MP4.breakNumberIntoBytes(height, 2)), [0x00, 0x00 // height
        ])));
      }
    }, {
      key: "traf",
      value: function traf(track, baseMediaDecodeTime) {
        var sampleDependencyTable = MP4.sdtp(track);
        var id = track.id;
        var upperWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime / (MP4.UINT32_MAX + 1));
        var lowerWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime % (MP4.UINT32_MAX + 1));
        return MP4.box(MP4.types.traf, MP4.box(MP4.types.tfhd, new Uint8Array([0x00,
        // version 0
        0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(id, 4))))), MP4.box(MP4.types.tfdt, new Uint8Array([0x01,
        // version 1
        0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(upperWordBaseMediaDecodeTime, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(lowerWordBaseMediaDecodeTime, 4))))), MP4.trun(track, sampleDependencyTable.length + 16 +
        // tfhd
        20 +
        // tfdt
        8 +
        // traf header
        16 +
        // mfhd
        8 +
        // moof header
        8 // mdat header
        ), sampleDependencyTable);
      }

      /**
       * Generate a track box.
       * @param track {object} a track definition
       * @return {Uint8Array} the track box
       */
    }, {
      key: "trak",
      value: function trak(track) {
        track.duration = track.duration || 0xffffffff;
        return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
      }
    }, {
      key: "trex",
      value: function trex(track) {
        var id = track.id;
        return MP4.box(MP4.types.trex, new Uint8Array([0x00,
        // version 0
        0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(id, 4)), [
        // track_ID
        0x00, 0x00, 0x00, 0x01,
        // default_sample_description_index
        0x00, 0x00, 0x00, 0x00,
        // default_sample_duration
        0x00, 0x00, 0x00, 0x00,
        // default_sample_size
        0x00, 0x01, 0x00, 0x01 // default_sample_flags
        ])));
      }
    }, {
      key: "trun",
      value: function trun(track, offset) {
        var samples = track.samples || [];
        var len = samples.length;
        var arraylen = 12 + 16 * len;
        var array = new Uint8Array(arraylen);
        var i, sample, duration, size, flags, cts;
        offset += 8 + arraylen;
        array.set([track.type === 'video' ? 0x01 : 0x00,
        // version 1 for video with signed-int sample_composition_time_offset
        0x00, 0x0f, 0x01].concat(_toConsumableArray(MP4.breakNumberIntoBytes(len, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(offset, 4))), 0);
        for (i = 0; i < len; i++) {
          sample = samples[i];
          duration = sample.duration;
          size = sample.size;
          flags = sample.flags;
          cts = sample.cts;
          array.set([].concat(_toConsumableArray(MP4.breakNumberIntoBytes(duration, 4)), _toConsumableArray(MP4.breakNumberIntoBytes(size, 4)), [
          // sample_size
          flags.isLeading << 2 | flags.dependsOn, flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.paddingValue << 1 | flags.isNonSync, flags.degradPrio & 0xf0 << 8, flags.degradPrio & 0x0f], _toConsumableArray(MP4.breakNumberIntoBytes(cts, 4))), 12 + 16 * i);
        }
        return MP4.box(MP4.types.trun, array);
      }
    }, {
      key: "hvc1",
      value: function hvc1(track) {
        if (!MP4.USE_M2TS_ADVANCED_CODECS) return new Uint8Array();
        var hvcc = MP4.box(MP4.types.hvcC, new Uint8Array([0x01, (track.params.general_profile_space & 0x03) << 6 | (track.params.general_tier_flag ? 1 : 0) << 5 | track.params.general_profile_idc & 0x1f].concat(_toConsumableArray(track.params.general_profile_compatibility_flags), _toConsumableArray(track.params.general_constraint_indicator_flags), [track.params.general_level_idc, 0xf0 | (track.params.min_spatial_segmentation_idc & 0x0f00) >> 8, track.params.min_spatial_segmentation_idc & 0xff, 0xfc | track.params.parallelism_type & 0x03, 0xfc | track.params.chroma_format_idc & 0x03, 0xf8 | track.params.bit_depth_luma_minus8 & 0x07, 0xf8 | track.params.bit_depth_chroma_minus8 & 0x07, 0x00, 0x00,
        // avgFrameRate
        (track.params.frame_rate.fixed & 0x03) << 6 | (track.params.num_temporal_layers & 0x07) << 3 | (track.params.temporal_id_nested ? 1 : 0) << 2 | 3, 0x03], _toConsumableArray(new Uint8Array([0x20].concat(_toConsumableArray(this.breakNumberIntoBytes(track.vps.length, 2)), _toConsumableArray(this.breakNumberIntoBytes(track.vps[0].byteLength, 2)), _toConsumableArray(track.vps[0])))), _toConsumableArray(new Uint8Array([0x21].concat(_toConsumableArray(this.breakNumberIntoBytes(track.sps.length, 2)), _toConsumableArray(this.breakNumberIntoBytes(track.sps[0].byteLength, 2)), _toConsumableArray(track.sps[0])))), _toConsumableArray(new Uint8Array([0x22].concat(_toConsumableArray(this.breakNumberIntoBytes(track.pps.length, 2)), _toConsumableArray(this.breakNumberIntoBytes(track.pps[0].byteLength, 2)), _toConsumableArray(track.pps[0])))))));
        return MP4.box(MP4.types.hvc1, new Uint8Array([0x00, 0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00,
        // reserved
        0x00, 0x01,
        // data_reference_index
        0x00, 0x00,
        // pre_defined
        0x00, 0x00,
        // reserved
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].concat(_toConsumableArray(MP4.breakNumberIntoBytes(track.width, 2)), _toConsumableArray(MP4.breakNumberIntoBytes(track.height, 2)), [
        // height
        0x00, 0x48, 0x00, 0x00,
        // horizresolution
        0x00, 0x48, 0x00, 0x00,
        // vertresolution
        0x00, 0x00, 0x00, 0x00,
        // reserved
        0x00, 0x01,
        // frame_count
        0x09, 0x6a, 0x6d, 0x75, 0x78,
        // jmuxer.js
        0x65, 0x72, 0x2e, 0x6a, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // compressorname
        0x18,
        // depth = 24
        0x11, 0x11 // pre_defined = -1
        ])), hvcc, MP4.box(MP4.types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80,
        // bufferSizeDB
        0x00, 0x2d, 0xc6, 0xc0,
        // maxBitrate
        0x00, 0x2d, 0xc6, 0xc0 // avgBitrate
        ])), MP4.box(MP4.types.pasp, new Uint8Array([].concat(_toConsumableArray(MP4.breakNumberIntoBytes(track.pixelRatio[0], 4)), _toConsumableArray(MP4.breakNumberIntoBytes(track.pixelRatio[1], 4))))));
      }
    }, {
      key: "initSegment",
      value: function initSegment(tracks) {
        if (!MP4.types) MP4.init();
        var movie = MP4.moov(tracks);
        var result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
        result.set(MP4.FTYP);
        result.set(movie, MP4.FTYP.byteLength);
        return result;
      }
    }, {
      key: "breakNumberIntoBytes",
      value: function breakNumberIntoBytes(number, numBytes) {
        var bytes = [];
        for (var _byte = numBytes - 1; _byte >= 0; _byte--) {
          bytes.push(number >> 8 * _byte & 0xff);
        }
        return bytes;
      }
    }]);
  }();

  var track_id = 1;
  var BaseRemuxer = /*#__PURE__*/function () {
    function BaseRemuxer() {
      _classCallCheck(this, BaseRemuxer);
    }
    return _createClass(BaseRemuxer, [{
      key: "flush",
      value: function flush() {
        this.mp4track.len = 0;
        this.mp4track.samples = [];
      }
    }, {
      key: "isReady",
      value: function isReady() {
        if (!this.readyToDecode || !this.samples.length) return null;
        return true;
      }
    }], [{
      key: "getTrackID",
      value: function getTrackID() {
        return track_id++;
      }
    }]);
  }();

  var AACRemuxer = /*#__PURE__*/function (_BaseRemuxer) {
    function AACRemuxer(timescale, duration) {
      var _this;
      _classCallCheck(this, AACRemuxer);
      _this = _callSuper(this, AACRemuxer);
      _this.readyToDecode = false;
      _this.nextDts = 0;
      _this.dts = 0;
      _this.mp4track = {
        id: BaseRemuxer.getTrackID(),
        type: 'audio',
        channelCount: 0,
        len: 0,
        fragmented: true,
        timescale: timescale,
        duration: duration,
        samples: [],
        config: '',
        codec: ''
      };
      _this.samples = [];
      _this.aac = new AACParser(_this);
      return _this;
    }
    _inherits(AACRemuxer, _BaseRemuxer);
    return _createClass(AACRemuxer, [{
      key: "resetTrack",
      value: function resetTrack() {
        this.readyToDecode = false;
        this.mp4track.codec = '';
        this.mp4track.channelCount = '';
        this.mp4track.config = '';
        this.mp4track.timescale = this.timescale;
        this.nextDts = 0;
        this.dts = 0;
      }
    }, {
      key: "remux",
      value: function remux(frames) {
        if (frames.length > 0) {
          for (var i = 0; i < frames.length; i++) {
            var frame = frames[i];
            var payload = frame.units;
            var size = payload.byteLength;
            this.samples.push({
              units: payload,
              size: size,
              duration: frame.duration
            });
            this.mp4track.len += size;
            if (!this.readyToDecode) {
              this.aac.setAACConfig();
            }
          }
        }
      }
    }, {
      key: "getPayload",
      value: function getPayload() {
        if (!this.isReady()) {
          return null;
        }
        var payload = new Uint8Array(this.mp4track.len);
        var offset = 0;
        var samples = this.mp4track.samples;
        var mp4Sample, duration;
        this.dts = this.nextDts;
        while (this.samples.length) {
          var sample = this.samples.shift();
            sample.units;
          duration = sample.duration;
          if (duration <= 0) {
            log("remuxer: invalid sample duration at DTS: ".concat(this.nextDts, " :").concat(duration));
            this.mp4track.len -= sample.size;
            continue;
          }
          this.nextDts += duration;
          mp4Sample = {
            size: sample.size,
            duration: duration,
            cts: 0,
            flags: {
              isLeading: 0,
              isDependedOn: 0,
              hasRedundancy: 0,
              degradPrio: 0,
              dependsOn: 1
            }
          };
          payload.set(sample.units, offset);
          offset += sample.size;
          samples.push(mp4Sample);
        }
        if (!samples.length) return null;
        return new Uint8Array(payload.buffer, 0, this.mp4track.len);
      }
    }, {
      key: "getAacParser",
      value: function getAacParser() {
        return this.aac;
      }
    }]);
  }(BaseRemuxer);

  var VideoRemuxer = /*#__PURE__*/function (_BaseRemuxer) {
    function VideoRemuxer(timescale, duration) {
      var _this;
      _classCallCheck(this, VideoRemuxer);
      _this = _callSuper(this, VideoRemuxer);
      _this.dts = 0;
      _this.parser = null;
      _this.nextDts = 0;
      _this.samples = [];
      _this.mp4track = {
        id: BaseRemuxer.getTrackID(),
        fps: 30,
        len: 0,
        pps: '',
        sps: '',
        vps: '',
        type: 'video',
        width: 0,
        height: 0,
        params: {},
        samples: [],
        duration: duration,
        timescale: timescale || 1000,
        fragmented: true,
        pixelRatio: [1, 1]
      };
      _this.readyToDecode = false;
      return _this;
    }
    _inherits(VideoRemuxer, _BaseRemuxer);
    return _createClass(VideoRemuxer, [{
      key: "resetTrack",
      value: function resetTrack() {
        this.dts = 0;
        this.nextDts = 0;
        this.mp4track.pps = '';
        this.mp4track.sps = '';
        this.mp4track.vps = '';
        this.readyToDecode = false;
      }
    }, {
      key: "remux",
      value: function remux(frames) {
        var _iterator = _createForOfIteratorHelper(frames),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var frame = _step.value;
            var size = 0;
            var units = [];
            var _iterator2 = _createForOfIteratorHelper(frame.units),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var unit = _step2.value;
                if (this.parser === null) this.parser = unit.initParser(this);
                if (this.parser.parseNAL(unit)) {
                  units.push(unit);
                  size += unit.getSize();
                } else console.log('parseNAL failed!');
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            if (units.length > 0 && this.readyToDecode) {
              this.mp4track.len += size;
              this.samples.push({
                size: size,
                units: units,
                duration: frame.duration,
                keyFrame: frame.keyFrame,
                compositionTimeOffset: frame.compositionTimeOffset
              });
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "getPayload",
      value: function getPayload() {
        if (!this.isReady()) return null;
        var payload = new Uint8Array(this.mp4track.len);
        var offset = 0;
        var samples = this.mp4track.samples;
        var mp4Sample, duration;
        this.dts = this.nextDts;
        while (this.samples.length) {
          var sample = this.samples.shift(),
            units = sample.units;
          duration = sample.duration;
          if (duration <= 0) {
            log("remuxer: invalid sample duration at DTS: ".concat(this.nextDts, " :").concat(duration));
            this.mp4track.len -= sample.size;
            continue;
          }
          this.nextDts += duration;
          mp4Sample = {
            size: sample.size,
            duration: duration,
            cts: sample.compositionTimeOffset || 0,
            flags: {
              isLeading: 0,
              isDependedOn: 0,
              hasRedundancy: 0,
              degradPrio: 0,
              isNonSync: sample.keyFrame ? 0 : 1,
              dependsOn: sample.keyFrame ? 2 : 1
            }
          };
          var _iterator3 = _createForOfIteratorHelper(units),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var unit = _step3.value;
              payload.set(unit.getData(), offset);
              offset += unit.getSize();
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          samples.push(mp4Sample);
        }
        if (!samples.length) return null;
        return new Uint8Array(payload.buffer, 0, this.mp4track.len);
      }
    }]);
  }(BaseRemuxer);

  var RemuxController = /*#__PURE__*/function (_Event) {
    function RemuxController(env, live) {
      var _this;
      _classCallCheck(this, RemuxController);
      _this = _callSuper(this, RemuxController, ['remuxer']);
      _this.seq = 1;
      _this.env = env;
      _this.tracks = {};
      _this.duration = live ? -1 : 0;
      _this.aacParser = null;
      _this.timescale = 1000;
      _this.trackTypes = [];
      _this.initialized = false;
      return _this;
    }
    _inherits(RemuxController, _Event);
    return _createClass(RemuxController, [{
      key: "addTrack",
      value: function addTrack(type) {
        if (type === 'video' || type === 'both') {
          this.tracks.video = new VideoRemuxer(this.timescale, this.duration);
          this.trackTypes.push('video');
        }
        if (type === 'audio' || type === 'both') {
          var aacRemuxer = new AACRemuxer(this.timescale, this.duration);
          this.aacParser = aacRemuxer.getAacParser();
          this.tracks.audio = aacRemuxer;
          this.trackTypes.push('audio');
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        var _iterator = _createForOfIteratorHelper(this.trackTypes),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var type = _step.value;
            this.tracks[type].resetTrack();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        this.initialized = false;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.tracks = {};
        this.offAll();
      }
    }, {
      key: "flush",
      value: function flush() {
        if (!this.initialized) {
          if (this.isReady()) {
            this.dispatch('ready');
            this.initSegment();
            this.initialized = true;
            this.flush();
          }
        } else {
          var _iterator2 = _createForOfIteratorHelper(this.trackTypes),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var type = _step2.value;
              var track = this.tracks[type];
              var pay = track.getPayload();
              if (pay && pay.byteLength) {
                var moof = MP4.moof(this.seq, track.dts, track.mp4track);
                var mdat = MP4.mdat(pay);
                var payload = appendByteArray(moof, mdat);
                var data = {
                  dts: track.dts,
                  type: type,
                  payload: payload
                };
                if (type === 'video') {
                  data.fps = track.mp4track.fps;
                  data.duration = this.duration;
                  data.timescale = this.timescale;
                }
                this.dispatch('buffer', data);
                var duration = secToTime(track.dts / this.timescale);
                log("put segment (".concat(type, "): dts: ").concat(track.dts, " frames: ").concat(track.mp4track.samples.length, " second: ").concat(duration));
                console.log("put segment (".concat(type, "): dts: ").concat(track.dts, " frames: ").concat(track.mp4track.samples.length, " second: ").concat(duration));
                track.flush();
                this.seq++;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    }, {
      key: "initSegment",
      value: function initSegment() {
        var tracks = [];
        var _iterator3 = _createForOfIteratorHelper(this.trackTypes),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var type = _step3.value;
            var track = this.tracks[type];
            if (this.env == 'browser') {
              var _data = {
                type: type,
                payload: MP4.initSegment([track.mp4track])
              };
              this.dispatch('buffer', _data);
            } else {
              tracks.push(track.mp4track);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        if (this.env == 'node') {
          var data = {
            type: 'all',
            payload: MP4.initSegment(tracks)
          };
          this.dispatch('buffer', data);
        }
        log('Initial segment generated.');
      }
    }, {
      key: "isReady",
      value: function isReady() {
        var _iterator4 = _createForOfIteratorHelper(this.trackTypes),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var type = _step4.value;
            if (!this.tracks[type].readyToDecode || !this.tracks[type].samples.length) return false;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        return true;
      }
    }, {
      key: "remux",
      value: function remux(data) {
        var _iterator5 = _createForOfIteratorHelper(this.trackTypes),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var type = _step5.value;
            var frames = data[type];
            if (type === 'audio' && this.tracks.video && !this.tracks.video.readyToDecode) continue; /* if video is present, don't add audio until video get ready */

            if (frames.length > 0) this.tracks[type].remux(frames);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        this.flush();
      }
    }]);
  }(Event);

  var BufferController = /*#__PURE__*/function (_Event) {
    function BufferController(sourceBuffer, type) {
      var _this;
      _classCallCheck(this, BufferController);
      _this = _callSuper(this, BufferController, ['buffer']);
      _this.type = type;
      _this.queue = new Uint8Array();
      _this.cleaning = false;
      _this.pendingCleaning = 0;
      _this.cleanOffset = 30;
      _this.cleanRanges = [];
      _this.sourceBuffer = sourceBuffer;
      _this.sourceBuffer.addEventListener('updateend', function () {
        if (_this.pendingCleaning > 0) {
          _this.initCleanup(_this.pendingCleaning);
          _this.pendingCleaning = 0;
        }
        _this.cleaning = false;
        if (_this.cleanRanges.length) {
          _this.doCleanup();
          return;
        }
      });
      _this.sourceBuffer.addEventListener('error', function () {
        _this.dispatch('error', {
          type: _this.type,
          name: 'buffer',
          error: 'buffer error'
        });
      });
      return _this;
    }
    _inherits(BufferController, _Event);
    return _createClass(BufferController, [{
      key: "feed",
      value: function feed(data) {
        this.queue = appendByteArray(this.queue, data);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.queue = null;
        this.sourceBuffer = null;
        this.offAll();
      }
    }, {
      key: "doAppend",
      value: function doAppend() {
        if (!this.queue.length) return;
        if (!this.sourceBuffer || this.sourceBuffer.updating) return;
        try {
          this.sourceBuffer.appendBuffer(this.queue);
          this.queue = new Uint8Array();
        } catch (e) {
          var name = 'unexpectedError';
          if (e.name === 'QuotaExceededError') {
            log("".concat(this.type, " buffer quota full"));
            name = 'QuotaExceeded';
          } else {
            error("Error occured while appending ".concat(this.type, " buffer - ").concat(e.name, ": ").concat(e.message));
            name = 'InvalidStateError';
          }
          this.dispatch('error', {
            type: this.type,
            name: name,
            error: 'buffer error'
          });
        }
      }
    }, {
      key: "doCleanup",
      value: function doCleanup() {
        if (!this.cleanRanges.length) {
          this.cleaning = false;
          return;
        }
        var range = this.cleanRanges.shift();
        log("".concat(this.type, " remove range [").concat(range[0], " - ").concat(range[1], ")"));
        this.cleaning = true;
        this.sourceBuffer.remove(range[0], range[1]);
      }
    }, {
      key: "initCleanup",
      value: function initCleanup(cleanMaxLimit) {
        try {
          if (this.sourceBuffer.updating) {
            this.pendingCleaning = cleanMaxLimit;
            return;
          }
          if (this.sourceBuffer.buffered && this.sourceBuffer.buffered.length && !this.cleaning) {
            for (var i = 0; i < this.sourceBuffer.buffered.length; ++i) {
              var start = this.sourceBuffer.buffered.start(i);
              var end = this.sourceBuffer.buffered.end(i);
              if (cleanMaxLimit - start > this.cleanOffset) {
                end = cleanMaxLimit - this.cleanOffset;
                if (start < end) {
                  this.cleanRanges.push([start, end]);
                }
              }
            }
            this.doCleanup();
          }
        } catch (e) {
          error("Error occured while cleaning ".concat(this.type, " buffer - ").concat(e.name, ": ").concat(e.message));
        }
      }
    }]);
  }(Event);

  var Stream = /*#__PURE__*/function () {
    function Stream() {
      _classCallCheck(this, Stream);
    }
    return _createClass(Stream, null, [{
      key: "NalUnitIsH265",
      value: function NalUnitIsH265(data) {
        if (data.length >= 2) {
          var forbidden_zero_bit = data[0] >> 7;
          var nal_unit_type_h264 = data[0] & 0x1f;
          var nal_unit_type_h265 = data[0] >> 1 & 0x3f;
          var nuh_temporal_id_plus1 = data[1] & 0x07;
          var _check_6bits = data[1] & 0x3f; // for *most* h265 NAL units, last 6 bits of 2nd byte equals `1`

          return forbidden_zero_bit === 0 && nal_unit_type_h265 >= 0 && nal_unit_type_h265 < 64 && (nal_unit_type_h264 > 31 || nal_unit_type_h264 <= 31 && nuh_temporal_id_plus1 > 0 && _check_6bits === 1);
        }
        return false;
      }
    }, {
      key: "extractNalUnits",
      value: function extractNalUnits(buffer) {
        var length = buffer.byteLength;
        var i = 0;
        var left;
        var value;
        var state = 0;
        var result = [];
        var lastIndex = 0;
        while (i < length) {
          value = buffer[i++];

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
                if (lastIndex !== i - state - 1) result.push(buffer.subarray(lastIndex, i - state - 1));
                lastIndex = i;
                state = 0;
              } else state = value === 0 ? 3 : 0;
              break;
          }
        }
        if (lastIndex < length) left = buffer.subarray(lastIndex, length);

        // result = NALu
        // left = buffer
        return [result, left];
      }
    }]);
  }();

  var JMuxer = /*#__PURE__*/function (_Event) {
    function JMuxer(options) {
      var _this;
      _classCallCheck(this, JMuxer);
      _this = _callSuper(this, JMuxer, ['jmuxer']);
      _this.isReset = false;
      var defaults = {
        fps: 30,
        mode: 'both',
        // both, audio, video
        node: '',
        debug: false,
        maxDelay: 500,
        timescale: 1000,
        clearBuffer: true,
        ignoreDelay: false,
        flushingTime: 500,
        readFpsFromTrack: false,
        // set true to fetch fps value from NALu
        onData: function onData() {},
        // function called when data is ready to be sent
        onReady: function onReady() {},
        // function called when MSE is ready to accept frames
        onError: function onError() {},
        // function called when jmuxer encounters any buffer related errors
        onMissingVideoFrames: function onMissingVideoFrames() {},
        // function called when jmuxer encounters any missing video frames
        onMissingAudioFrames: function onMissingAudioFrames() {} // function called when jmuxer encounters any missing audio frames
      };
      _this.options = Object.assign({}, defaults, options);
      _this.env = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && typeof window === 'undefined' ? 'node' : 'browser';
      if (_this.options.debug) {
        setLogger();
      }
      if (!_this.options.fps) {
        _this.options.fps = 30;
      }
      _this.fpsUpdated = false;
      _this.frameDuration = _this.options.timescale / _this.options.fps | 0;
      _this.remuxController = new RemuxController(_this.env, _this.options.live);
      _this.remuxController.addTrack(_this.options.mode);
      _this.initData();

      /* events callback */
      _this.remuxController.on('buffer', _this.onBuffer.bind(_this));
      if (_this.env == 'browser') {
        _this.remuxController.on('ready', _this.createBuffer.bind(_this));
        _this.initBrowser();
      }
      return _this;
    }
    _inherits(JMuxer, _Event);
    return _createClass(JMuxer, [{
      key: "initData",
      value: function initData() {
        this.kfCounter = 0;
        this.kfPosition = [];
        this.pendingUnits = {};
        this.remainingData = new Uint8Array();
        this.lastCleaningTime = Date.now();
        this.startInterval();
      }
    }, {
      key: "initBrowser",
      value: function initBrowser() {
        if (typeof this.options.node === 'string' && this.options.node == '') {
          error('no video element were found to render, provide a valid video element');
        }
        this.node = typeof this.options.node === 'string' ? document.getElementById(this.options.node) : this.options.node;
        this.mseReady = false;
        this.setupMSE();
      }
    }, {
      key: "createStream",
      value: function createStream() {
        var feed = this.feed.bind(this);
        var destroy = this.destroy.bind(this);
        this.stream = new stream.Duplex({
          writableObjectMode: true,
          read: function read(size) {},
          write: function write(data, encoding, callback) {
            feed(data);
            callback();
          },
          "final": function final(callback) {
            destroy();
            callback();
          }
        });
        return this.stream;
      }
    }, {
      key: "setupMSE",
      value: function setupMSE() {
        window.MediaSource = window.MediaSource || window.WebKitMediaSource || window.ManagedMediaSource;
        if (!window.MediaSource) {
          throw 'Oops! Browser does not support Media Source Extension or Managed Media Source (iOS 17+).';
        }
        this.isMSESupported = !!window.MediaSource;
        this.mediaSource = new window.MediaSource();
        this.url = URL.createObjectURL(this.mediaSource);
        if (window.MediaSource === window.ManagedMediaSource) {
          try {
            this.node.removeAttribute('src');
            // ManagedMediaSource will not open without disableRemotePlayback set to false or source alternatives
            this.node.disableRemotePlayback = true;
            var source = document.createElement('source');
            source.type = 'video/mp4';
            source.src = this.url;
            this.node.appendChild(source);
            this.node.load();
          } catch (error) {
            this.node.src = this.url;
          }
        } else {
          this.node.src = this.url;
        }
        this.mseEnded = false;
        this.mediaSource.addEventListener('sourceopen', this.onMSEOpen.bind(this));
        this.mediaSource.addEventListener('sourceclose', this.onMSEClose.bind(this));
        this.mediaSource.addEventListener('webkitsourceopen', this.onMSEOpen.bind(this));
        this.mediaSource.addEventListener('webkitsourceclose', this.onMSEClose.bind(this));
      }
    }, {
      key: "endMSE",
      value: function endMSE() {
        if (!this.mseEnded) {
          try {
            this.mseEnded = true;
            this.mediaSource.endOfStream();
          } catch (e) {
            error('mediasource is not available to end');
          }
        }
      }
    }, {
      key: "feed",
      value: function feed(data) {
        var left,
          remux = false,
          chunks = {
            video: [],
            audio: []
          },
          slices,
          duration;
        if (!data || !this.remuxController) return;
        duration = data.duration ? parseInt(data.duration) : 0;
        if (data.video) {
          data.video = appendByteArray(this.remainingData, data.video);
          var _Stream$extractNalUni = Stream.extractNalUnits(data.video);
          var _Stream$extractNalUni2 = _slicedToArray(_Stream$extractNalUni, 2);
          slices = _Stream$extractNalUni2[0];
          left = _Stream$extractNalUni2[1];
          this.remainingData = left || new Uint8Array();
          if (slices.length > 0) {
            chunks.video = this.getVideoFrames(slices, duration, data.compositionTimeOffset);
            remux = true;
          } else {
            error('Failed to extract any NAL units from video data:', left);
            if (typeof this.options.onMissingVideoFrames === 'function') {
              this.options.onMissingVideoFrames.call(null, data);
            }
            return;
          }
        }
        if (data.audio) {
          slices = AACParser.extractAAC(data.audio);
          if (slices.length > 0) {
            chunks.audio = this.getAudioFrames(slices, duration);
            remux = true;
          } else {
            error('Failed to extract audio data from:', data.audio);
            if (typeof this.options.onMissingAudioFrames === 'function') {
              this.options.onMissingAudioFrames.call(null, data);
            }
            return;
          }
        }
        if (!remux) {
          log('Input object must have video and/or audio property. Make sure it is a valid typed array');
          return;
        }
        this.remuxController.remux(chunks);
      }
    }, {
      key: "getVideoFrames",
      value: function getVideoFrames(nalus, duration, compositionTimeOffset) {
        var _this2 = this;
        var fd = 0,
          tt = 0,
          vcl = false,
          units = [],
          frames = [],
          keyFrame = false;
        if (this.pendingUnits.units) {
          vcl = this.pendingUnits.vcl;
          units = this.pendingUnits.units;
          keyFrame = this.pendingUnits.keyFrame;
          this.pendingUnits = {};
        }
        var _iterator = _createForOfIteratorHelper(nalus),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var nalu = _step.value;
            var unit = Stream.NalUnitIsH265(nalu) ? new H265NalUnit(nalu) : new H264NalUnit(nalu);
            if (units.length && vcl && (unit.isfmb || !unit.isvcl)) {
              frames.push({
                units: units,
                keyFrame: keyFrame
              });
              vcl = false;
              units = [];
              keyFrame = false;
            }
            units.push(unit);
            vcl = vcl || unit.isvcl;
            keyFrame = keyFrame || unit.isKeyframe();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (units.length) {
          // lets keep indecisive nalus as pending in case of fixed fps
          if (!duration) {
            this.pendingUnits = {
              units: units,
              keyFrame: keyFrame,
              vcl: vcl
            };
          } else if (vcl) {
            frames.push({
              units: units,
              keyFrame: keyFrame
            });
          } else {
            var last = frames.length - 1;
            if (last >= 0) frames[last].units = frames[last].units.concat(units);
          }
        }
        fd = duration ? duration / frames.length | 0 : this.frameDuration;
        tt = duration ? duration - fd * frames.length : 0;
        frames.map(function (frame) {
          frame.duration = fd;
          frame.compositionTimeOffset = compositionTimeOffset;
          if (tt > 0) {
            frame.duration++;
            tt--;
          }
          _this2.kfCounter++;
          if (frame.keyFrame && _this2.options.clearBuffer) {
            _this2.kfPosition.push(_this2.kfCounter * fd / 1000);
          }
        });
        log("jmuxer: No. of frames of the last chunk: ".concat(frames.length));
        return frames;
      }
    }, {
      key: "getAudioFrames",
      value: function getAudioFrames(aacFrames, duration) {
        var frames = [],
          fd = 0,
          tt = 0;
        var _iterator2 = _createForOfIteratorHelper(aacFrames),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var units = _step2.value;
            frames.push({
              units: units
            });
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        fd = duration ? duration / frames.length | 0 : this.frameDuration;
        tt = duration ? duration - fd * frames.length : 0;
        frames.map(function (frame) {
          frame.duration = fd;
          if (tt > 0) {
            frame.duration++;
            tt--;
          }
        });
        return frames;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.stopInterval();
        if (this.stream) {
          this.remuxController.flush();
          this.stream.push(null);
          this.stream = null;
        }
        if (this.remuxController) {
          this.remuxController.destroy();
          this.remuxController = null;
        }
        if (this.bufferControllers) {
          for (var type in this.bufferControllers) {
            this.bufferControllers[type].destroy();
          }
          this.bufferControllers = null;
          this.endMSE();
        }
        this.node = false;
        this.mseReady = false;
        this.videoStarted = false;
        this.mediaSource = null;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.stopInterval();
        this.isReset = true;
        this.node.pause();
        if (this.remuxController) {
          this.remuxController.reset();
        }
        if (this.bufferControllers) {
          for (var type in this.bufferControllers) {
            this.bufferControllers[type].destroy();
          }
          this.bufferControllers = null;
          this.endMSE();
        }
        this.initData();
        if (this.env == 'browser') {
          this.initBrowser();
        }
        log('JMuxer was reset');
      }
    }, {
      key: "createBuffer",
      value: function createBuffer() {
        if (!this.mseReady || !this.remuxController || !this.remuxController.isReady() || this.bufferControllers) return;
        this.bufferControllers = {};
        for (var type in this.remuxController.tracks) {
          var track = this.remuxController.tracks[type];
          if (!JMuxer.isSupported("".concat(type, "/mp4; codecs=\"").concat(track.mp4track.codec, "\""))) {
            error('Browser does not support codec');
            return false;
          }
          var sb = this.mediaSource.addSourceBuffer("".concat(type, "/mp4; codecs=\"").concat(track.mp4track.codec, "\""));
          this.bufferControllers[type] = new BufferController(sb, type);
          this.bufferControllers[type].on('error', this.onBufferError.bind(this));
        }
      }
    }, {
      key: "startInterval",
      value: function startInterval() {
        var _this3 = this;
        this.interval = setInterval(function () {
          if (_this3.options.flushingTime) {
            _this3.applyAndClearBuffer();
          } else if (_this3.bufferControllers) {
            _this3.cancelDelay();
          }
        }, this.options.flushingTime || 1000);
      }
    }, {
      key: "stopInterval",
      value: function stopInterval() {
        if (this.interval) {
          clearInterval(this.interval);
        }
      }
    }, {
      key: "cancelDelay",
      value: function cancelDelay() {
        if (!this.options.ignoreDelay) {
          if (this.node.buffered && this.node.buffered.length > 0 && !this.node.seeking) {
            var end = this.node.buffered.end(0);
            if (end - this.node.currentTime > this.options.maxDelay / 1000) {
              this.node.currentTime = end - 0.001;
            }
          }
        }
      }
    }, {
      key: "releaseBuffer",
      value: function releaseBuffer() {
        for (var type in this.bufferControllers) {
          this.bufferControllers[type].doAppend();
        }
      }
    }, {
      key: "applyAndClearBuffer",
      value: function applyAndClearBuffer() {
        if (this.bufferControllers) {
          this.releaseBuffer();
          this.clearBuffer();
        }
      }
    }, {
      key: "getSafeClearOffsetOfBuffer",
      value: function getSafeClearOffsetOfBuffer(offset) {
        var maxLimit = this.options.mode === 'audio' && offset || 0,
          adjacentOffset;
        for (var i = 0; i < this.kfPosition.length; i++) {
          if (this.kfPosition[i] >= offset) {
            break;
          }
          adjacentOffset = this.kfPosition[i];
        }
        if (adjacentOffset) {
          this.kfPosition = this.kfPosition.filter(function (kfDelimiter) {
            if (kfDelimiter < adjacentOffset) {
              maxLimit = kfDelimiter;
            }
            return kfDelimiter >= adjacentOffset;
          });
        }
        return maxLimit;
      }
    }, {
      key: "clearBuffer",
      value: function clearBuffer() {
        if (this.options.clearBuffer && Date.now() - this.lastCleaningTime > 10000) {
          for (var type in this.bufferControllers) {
            var cleanMaxLimit = this.getSafeClearOffsetOfBuffer(this.node.currentTime);
            this.bufferControllers[type].initCleanup(cleanMaxLimit);
          }
          this.lastCleaningTime = Date.now();
        }
      }
    }, {
      key: "onBuffer",
      value: function onBuffer(data) {
        if (this.options.readFpsFromTrack && typeof data.fps !== 'undefined' && this.options.fps != data.fps) {
          this.fpsUpdated = true;
          this.options.fps = data.fps;
          this.frameDuration = 1000 / data.fps;
          log("JMuxer changed FPS to ".concat(data.fps, " from track data"));
        }
        if (this.env == 'browser') {
          if (this.bufferControllers && this.bufferControllers[data.type]) {
            this.bufferControllers[data.type].feed(data.payload);
          }
        } else if (this.stream) {
          this.stream.push(data.payload);
        }
        if (this.options.onData) {
          this.options.onData(data.payload);
        }
        if (this.options.flushingTime === 0) {
          this.applyAndClearBuffer();
        }
      }

      /* Events on MSE */
    }, {
      key: "onMSEOpen",
      value: function onMSEOpen() {
        this.mseReady = true;
        URL.revokeObjectURL(this.url);
        // this.createBuffer();
        if (typeof this.options.onReady === 'function') {
          this.options.onReady.call(null, this.isReset, this.mediaSource);
        }
      }
    }, {
      key: "onMSEClose",
      value: function onMSEClose() {
        this.mseReady = false;
        this.videoStarted = false;
      }
    }, {
      key: "onBufferError",
      value: function onBufferError(data) {
        if (data.name == 'QuotaExceeded') {
          log("JMuxer cleaning ".concat(data.type, " buffer due to QuotaExceeded error"));
          this.bufferControllers[data.type].initCleanup(this.node.currentTime);
          return;
        } else if (data.name == 'InvalidStateError') {
          log('JMuxer is reseting due to InvalidStateError');
          this.reset();
        } else {
          this.endMSE();
        }
        if (typeof this.options.onError === 'function') {
          this.options.onError.call(null, data);
        }
      }
    }], [{
      key: "isSupported",
      value: function isSupported(codec) {
        return window.MediaSource && window.MediaSource.isTypeSupported(codec);
      }
    }]);
  }(Event);

  return JMuxer;

}));

/**
 * Generate MP4 Box
 * taken from: https://github.com/dailymotion/hls.js
 */

export class MP4 {
    static get UINT32_MAX () { return Math.pow(2, 32) - 1; }
    
    static init () {
        MP4.types = {
            avc1: [], // codingname
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
            smhd: [],
        };
        
        for (let i in MP4.types) {
            if (MP4.types.hasOwnProperty(i)) {
                MP4.types[i] = [
                    i.charCodeAt(0),
                    i.charCodeAt(1),
                    i.charCodeAt(2),
                    i.charCodeAt(3),
                ];
            }
        }
        
        const videoHdlr = new Uint8Array([
            0x00, // version 0
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x00, // pre_defined
            0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
            0x00, 0x00, 0x00, 0x00, // reserved
            0x00, 0x00, 0x00, 0x00, // reserved
            0x00, 0x00, 0x00, 0x00, // reserved
            0x56, 0x69, 0x64, 0x65,
            0x6f, 0x48, 0x61, 0x6e,
            0x64, 0x6c, 0x65, 0x72, 0x00, // name: 'VideoHandler'
        ]);
        
        const audioHdlr = new Uint8Array([
            0x00, // version 0
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x00, // pre_defined
            0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
            0x00, 0x00, 0x00, 0x00, // reserved
            0x00, 0x00, 0x00, 0x00, // reserved
            0x00, 0x00, 0x00, 0x00, // reserved
            0x53, 0x6f, 0x75, 0x6e,
            0x64, 0x48, 0x61, 0x6e,
            0x64, 0x6c, 0x65, 0x72, 0x00, // name: 'SoundHandler'
        ]);
        
        MP4.HDLR_TYPES = {
            video: videoHdlr,
            audio: audioHdlr,
        };
        
        const dref = new Uint8Array([
            0x00, // version 0
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x01, // entry_count
            0x00, 0x00, 0x00, 0x0c, // entry_size
            0x75, 0x72, 0x6c, 0x20, // 'url' type
            0x00, // version 0
            0x00, 0x00, 0x01, // entry_flags
        ]);
        
        const stco = new Uint8Array([
            0x00, // version
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x00, // entry_count
        ]);
        
        MP4.STTS = MP4.STSC = MP4.STCO = stco;
        
        MP4.STSZ = new Uint8Array([
            0x00, // version
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x00, // sample_size
            0x00, 0x00, 0x00, 0x00, // sample_count
        ]);
        MP4.VMHD = new Uint8Array([
            0x00, // version
            0x00, 0x00, 0x01, // flags
            0x00, 0x00, // graphicsmode
            0x00, 0x00,
            0x00, 0x00,
            0x00, 0x00, // opcolor
        ]);
        MP4.SMHD = new Uint8Array([
            0x00, // version
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, // balance
            0x00, 0x00, // reserved
        ]);
        MP4.STSD = new Uint8Array([
            0x00, // version 0
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x01,
        ]);// entry_count
        
        const major_brand = 'iso6';//'isom';
        const minor_version = 1;
        const compatible_brands = [
            major_brand,
            //'avc1',
            'dash',
            'msdh',
        ];
        
        MP4.FTYP = MP4.box(
            MP4.types.ftyp,
            new Uint8Array([
                ...Array.from(major_brand).map(letter => letter.charCodeAt(0)),
                ...this.breakNumberIntoBytes(minor_version, 4),
                ...Array.from(compatible_brands.join('')).map(letter => letter.charCodeAt(0)),
            ]),
        );
        
        MP4.DINF = MP4.box(
            MP4.types.dinf,
            MP4.box(
                MP4.types.dref,
                dref,
            ),
        );
    }
    
    static box (type, ...payload) {
        let size = 8;
        let i = payload.length;
        const len = i;
        
        // calculate the total size we need to allocate
        while (i --)
            size += payload[i].byteLength;
        
        const result = new Uint8Array(size);
        result.set(MP4.breakNumberIntoBytes(size, 4));
        result.set(type, 4);
        
        // copy the payload into the result
        for (i = 0, size = 8; i < len; ++ i) {
            // copy payload[i] array @ offset size
            result.set(payload[i], size);
            size += payload[i].byteLength;
        }
        
        return result;
    }
    
    static hdlr (type) {
        return MP4.box(
            MP4.types.hdlr,
            MP4.HDLR_TYPES[type],
        );
    }
    
    static mdat (data) {
        return MP4.box(
            MP4.types.mdat,
            data,
        );
    }
    
    static mdhd (timescale, duration) {
        const upperWordDuration = duration === -1 ? 0xffffffff : Math.floor(duration / (MP4.UINT32_MAX + 1));
        const lowerWordDuration = duration === -1 ? 0xffffffff : Math.floor(duration % (MP4.UINT32_MAX + 1));
        
        return MP4.box(MP4.types.mdhd, new Uint8Array([
            0x01, // version 1
            0x00, 0x00, 0x00, // flags
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x02, // creation_time
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x03, // modification_time
            ...MP4.breakNumberIntoBytes(timescale, 4), // timescale
            ...MP4.breakNumberIntoBytes(upperWordDuration, 4),
            ...MP4.breakNumberIntoBytes(lowerWordDuration, 4),
            0x55, 0xc4, // 'und' language (undetermined)
            0x00, 0x00,
        ]));
    }
    
    static mdia (track) {
        return MP4.box(
            MP4.types.mdia,
            MP4.mdhd(track.timescale || 0, track.duration || 0),
            MP4.hdlr(track.type),
            MP4.minf(track),
        );
    }
    
    static mfhd (sequenceNumber) {
        return MP4.box(
            MP4.types.mfhd,
            new Uint8Array([
                0x00,
                0x00, 0x00, 0x00, // flags
                ...MP4.breakNumberIntoBytes(sequenceNumber, 4), // sequence_number
            ]),
        );
    }
    
    static minf (track) {
        if (track.type === 'audio') {
            return MP4.box(
                MP4.types.minf,
                MP4.box(
                    MP4.types.smhd,
                    MP4.SMHD,
                ),
                MP4.DINF,
                MP4.stbl(track),
            );
        }
        else {
            return MP4.box(
                MP4.types.minf,
                MP4.box(
                    MP4.types.vmhd,
                    MP4.VMHD,
                ),
                MP4.DINF,
                MP4.stbl(track),
            );
        }
    }
    
    static moof (sn, baseMediaDecodeTime, track) {
        return MP4.box(
            MP4.types.moof,
            MP4.mfhd(sn),
            MP4.traf(track, baseMediaDecodeTime),
        );
    }
    
    static moov (tracks) {
        let i = tracks.length,
            boxes = [];
        
        while (i --) {
            boxes[i] = MP4.trak(tracks[i]);
        }
        
        return MP4.box.apply(
            null,
            [
                MP4.types.moov,
                MP4.mvhd(tracks[0].timescale || 0, tracks[0].duration || 0),
            ]
            .concat(boxes)
            .concat(MP4.mvex(tracks))
        );
    }
    
    static mvex (tracks) {
        let i = tracks.length,
            boxes = [];
        
        while (i --) {
            boxes[i] = MP4.trex(tracks[i]);
        }
        
        return MP4.box.apply(
            null,
            [
                MP4.types.mvex,
                ...boxes,
            ]
        );
    }
    
    static mvhd (timescale, duration) {
        const upperWordDuration = duration === -1 ? 0xffffffff : Math.floor(duration / (MP4.UINT32_MAX + 1));
        const lowerWordDuration = duration === -1 ? 0xffffffff : Math.floor(duration % (MP4.UINT32_MAX + 1));
        
        return MP4.box(
            MP4.types.mvhd,
            new Uint8Array([
                0x01, // version 1
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x02, // creation_time
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x03, // modification_time
                ...MP4.breakNumberIntoBytes(timescale, 4), // timescale
                ...MP4.breakNumberIntoBytes(upperWordDuration, 4),
                ...MP4.breakNumberIntoBytes(lowerWordDuration, 4),
                0x00, 0x01, 0x00, 0x00, // 1.0 rate
                0x01, 0x00, // 1.0 volume
                0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // pre_defined
                0xff, 0xff, 0xff, 0xff, // next_track_ID
            ]),
        );
    }
    
    static sdtp (track) {
        let samples = track.samples || [],
            bytes = new Uint8Array(4 + samples.length),
            flags,
            i;
        
        // leave the full box header (4 bytes) all zero
        // write the sample table
        for (i = 0; i < samples.length; i ++) {
            flags = samples[i].flags;
            bytes[i + 4] =
                (flags.dependsOn << 4) |
                (flags.isDependedOn << 2) |
                (flags.hasRedundancy);
        }
        
        return MP4.box(
            MP4.types.sdtp,
            bytes,
        );
    }
    
    static stbl (track) {
        return MP4.box(
            MP4.types.stbl,
            MP4.stsd(track),
            MP4.box(
                MP4.types.stts,
                MP4.STTS,
            ),
            MP4.box(
                MP4.types.stsc,
                MP4.STSC,
            ),
            MP4.box(
                MP4.types.stsz,
                MP4.STSZ,
            ),
            MP4.box(
                MP4.types.stco,
                MP4.STCO,
            ),
        );
    }
    
    static avc1 (track) {
        let sps = [],
            pps = [],
            i,
            data,
            len;
            
        // assemble the SPSs
        for (i = 0; i < track.sps.length; i ++) {
            data = track.sps[i];
            len = data.byteLength;
            sps.push((len >>> 8) & 0xFF);
            sps.push((len & 0xFF));
            
            sps = sps.concat(Array.prototype.slice.call(data)); // SPS
        }
        
        // assemble the PPSs
        for (i = 0; i < track.pps.length; i ++) {
            data = track.pps[i];
            len = data.byteLength;
            pps.push((len >>> 8) & 0xFF);
            pps.push((len & 0xFF));
            
            pps = pps.concat(Array.prototype.slice.call(data));
        }
        
        const avcc = MP4.box(
            MP4.types.avcC,
            new Uint8Array([
                0x01, // version
                sps[3], // profile
                sps[4], // profile compat
                sps[5], // level
                0xfc | 3, // lengthSizeMinusOne, hard-coded to 4 bytes
                0xE0 | track.sps.length, // 3bit reserved (111) + numOfSequenceParameterSets
            ]
            .concat(sps)
            .concat([
                track.pps.length, // numOfPictureParameterSets
            ])
            .concat(pps)),
        ); // "PPS"
        
        const width = track.width;
        const height = track.height;
        const hSpacing = track.pixelRatio[0];
        const vSpacing = track.pixelRatio[1];
        
        return MP4.box(
            MP4.types.avc1,
            new Uint8Array([
                0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // data_reference_index
                0x00, 0x00, // pre_defined
                0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // pre_defined
                ...MP4.breakNumberIntoBytes(width, 2), // width
                ...MP4.breakNumberIntoBytes(height, 2), // height
                0x00, 0x48, 0x00, 0x00, // horizresolution
                0x00, 0x48, 0x00, 0x00, // vertresolution
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // frame_count
                0x09,
                0x6a, 0x6d, 0x75, 0x78, // jmuxer.js
                0x65, 0x72, 0x2e, 0x6a,
                0x73, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // compressorname
                0x18, // depth = 24
                0x11, 0x11, // pre_defined = -1
            ]),
            avcc,
            MP4.box(
                MP4.types.btrt,
                new Uint8Array([
                    0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
                    0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
                    0x00, 0x2d, 0xc6, 0xc0, // avgBitrate
                ]),
            ),
            MP4.box(
                MP4.types.pasp,
                new Uint8Array([
                    ...MP4.breakNumberIntoBytes(hSpacing, 4), // hSpacing
                    ...MP4.breakNumberIntoBytes(vSpacing, 4), // vSpacing
              ]),
            ),
        );
    }
    
    /* TO FIX! */
    static esds (track) {
        const configlen = track.config.byteLength;
        let data = new Uint8Array(26 + configlen + 3);
        
        data.set([
            0x00, // version 0
            0x00, 0x00, 0x00, // flags
            
            0x03, // descriptor_type
            0x17 + configlen, // length
            0x00, 0x01, // es_id
            0x00, // stream_priority
            
            0x04, // descriptor_type
            0x0f + configlen, // length
            0x40, // codec : mpeg4_audio
            0x15, // stream_type
            0x00, 0x00, 0x00, // buffer_size
            0x00, 0x00, 0x00, 0x00, // maxBitrate
            0x00, 0x00, 0x00, 0x00, // avgBitrate
            
            0x05, // descriptor_type
            configlen,
        ]);
        data.set(track.config, 26);
        data.set([0x06, 0x01, 0x02], 26 + configlen);
        
        return data;
    }
    
    static audioStsd (track) {
        const samplerate = track.samplerate || 0;
        return new Uint8Array([
            0x00, 0x00, 0x00, // reserved
            0x00, 0x00, 0x00, // reserved
            0x00, 0x01, // data_reference_index
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, // reserved
            0x00,
            track.channelCount || 0, // channelcount
            0x00, 0x10, // sampleSize:16bits
            0x00, 0x00, 0x00, 0x00, // reserved2
            ...MP4.breakNumberIntoBytes(samplerate, 2), // samplerate
            0x00, 0x00,
        ]);
    }
    
    static mp4a (track) {
        return MP4.box(
            MP4.types.mp4a,
            MP4.audioStsd(track),
            MP4.box(
                MP4.types.esds,
                MP4.esds(track),
            ),
        );
    }
    
    static mp3 (track) {
        return MP4.box(
            MP4.types['.mp3'],
            MP4.audioStsd(track),
        );
    }
    
    static ac3 (track) {
        return MP4.box(
            MP4.types['ac-3'],
            MP4.audioStsd(track),
            MP4.box(
                MP4.types.dac3,
                new Uint8Array(track.config),
            ),
        );
    }
    
    static stsd (track) {
        const segmentCodec = track.segmentCodec;
        
        if (track.type === 'audio') {
            if (segmentCodec === 'aac') {
                return MP4.box(
                    MP4.types.stsd,
                    MP4.STSD,
                    MP4.mp4a(track),
                );
            }
            
            if (segmentCodec === 'ac3' && track.config) {
                return MP4.box(
                    MP4.types.stsd,
                    MP4.STSD,
                    MP4.ac3(track),
                );
            }
            
            if (segmentCodec === 'mp3' && track.codec === 'mp3') {
                return MP4.box(
                    MP4.types.stsd,
                    MP4.STSD,
                    MP4.mp3(track),
                );
            }
        }
        else {
            if (track.pps && track.sps) {
                if (segmentCodec === 'avc') {
                    return MP4.box(
                        MP4.types.stsd,
                        MP4.STSD,
                        MP4.avc1(track),
                    );
                }
                
                if (segmentCodec === 'hevc' && track.vps) {
                    return MP4.box(
                        MP4.types.stsd,
                        MP4.STSD,
                        MP4.hvc1(track),
                    );
                }
            }
            else {
                throw new Error(`video track missing pps or sps`);
            }
        }
        
        throw new Error(`unsupported ${track.type} segment codec (${segmentCodec}/${track.codec})`);
    }
    
    static tkhd (track) {
        const id = track.id;
        const width = track.width || 0;
        const height = track.height || 0;
        const duration = (track.duration || 0) * (track.timescale || 0);
        const upperWordDuration = track.duration === -1 ? 0xffffffff : Math.floor(duration / (MP4.UINT32_MAX + 1));
        const lowerWordDuration = track.duration === -1 ? 0xffffffff : Math.floor(duration % (MP4.UINT32_MAX + 1));
        
        return MP4.box(
            MP4.types.tkhd,
            new Uint8Array([
                0x01, // version 1
                0x00, 0x00, 0x07, // flags
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x02, // creation_time
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x03, // modification_time
                ...MP4.breakNumberIntoBytes(id, 4), // track_ID
                0x00, 0x00, 0x00, 0x00, // reserved
                ...MP4.breakNumberIntoBytes(upperWordDuration, 4),
                ...MP4.breakNumberIntoBytes(lowerWordDuration, 4), // duration
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, // layer
                0x00, 0x00, // alternate_group
                0x00, 0x00, // non-audio track volume
                0x00, 0x00, // reserved
                0x00, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
                ...MP4.breakNumberIntoBytes(width, 2),
                0x00, 0x00, // width
                ...MP4.breakNumberIntoBytes(height, 2),
                0x00, 0x00, // height
            ]),
        );
    }
    
    static traf (track, baseMediaDecodeTime) {
        const id = track.id;
        const sampleDependencyTable = MP4.sdtp(track);
        const upperWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime / (MP4.UINT32_MAX + 1));
        const lowerWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime % (MP4.UINT32_MAX + 1));
      
        return MP4.box(
            MP4.types.traf,
            MP4.box(
                MP4.types.tfhd,
                new Uint8Array([
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    ...MP4.breakNumberIntoBytes(id, 4), // track_ID
                ]),
            ),
            MP4.box(
                MP4.types.tfdt,
                new Uint8Array([
                    0x01, // version 1
                    0x00, 0x00, 0x00, // flags
                    ...MP4.breakNumberIntoBytes(upperWordBaseMediaDecodeTime, 4),
                    ...MP4.breakNumberIntoBytes(lowerWordBaseMediaDecodeTime, 4), // baseMediaDecodeTime
                ]),
            ),
            MP4.trun(
                track,
                sampleDependencyTable.length +
                    16 + // tfhd
                    20 + // tfdt
                    8 + // traf header
                    16 + // mfhd
                    8 + // moof header
                    8, // mdat header
            ),
            sampleDependencyTable,
        );
    }
    
    /**
     * Generate a track box.
     * @param track {object} a track definition
     * @return {Uint8Array} the track box
     */
    static trak (track) {
        track.duration = track.duration || 0xffffffff;
        return MP4.box(
            MP4.types.trak,
            MP4.tkhd(track),
            MP4.mdia(track),
        );
    }
    
    static trex (track) {
        const id = track.id;
        return MP4.box(
            MP4.types.trex,
            new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                ...MP4.breakNumberIntoBytes(id, 4), // track_ID
                0x00, 0x00, 0x00, 0x01, // default_sample_description_index
                0x00, 0x00, 0x00, 0x00, // default_sample_duration
                0x00, 0x00, 0x00, 0x00, // default_sample_size
                0x00, 0x01, 0x00, 0x01, // default_sample_flags
            ]),
        );
    }
    
    static trun (track, offset) {
        const samples = track.samples || [];
        const len = samples.length;
        const arraylen = 12 + (16 * len);
        const array = new Uint8Array(arraylen);
        
        let i,
            sample,
            duration,
            size,
            flags,
            cts;
        
        offset += 8 + arraylen;
        
        array.set(
            [
                track.type === 'video' ? 0x01 : 0x00, // version 1 for video with signed-int sample_composition_time_offset
                0x00, 0x0f, 0x01, // flags
                ...MP4.breakNumberIntoBytes(len, 4), // sample_count
                ...MP4.breakNumberIntoBytes(offset, 4), // data_offset
            ],
            0,
        );
        
        for (i = 0; i < len; i ++) {
            sample = samples[i];
            duration = sample.duration;
            size = sample.size;
            flags = sample.flags;
            cts = sample.cts;
            
            array.set(
                [
                    ...MP4.breakNumberIntoBytes(duration, 4), // sample_duration
                    ...MP4.breakNumberIntoBytes(size, 4), // sample_size
                    (flags.isLeading << 2) | flags.dependsOn,
                    (flags.isDependedOn << 6) |
                        (flags.hasRedundancy << 4) |
                        (flags.paddingValue << 1) |
                        flags.isNonSync,
                    flags.degradPrio & 0xf0 << 8,
                    flags.degradPrio & 0x0f, // sample_flags
                    ...MP4.breakNumberIntoBytes(cts, 4), // sample_composition_time_offset
                ],
                12 + (16 * i),
            );
        }
        
        return MP4.box(
            MP4.types.trun,
            array,
        );
    }
    
    static hvc1 (track) {
        const hvcc = MP4.box(
            MP4.types.hvcC,
            new Uint8Array([
                0x01,
                ((track.params.general_profile_space & 0x03) << 6) | ((track.params.general_tier_flag ? 1 : 0) << 5) | (track.params.general_profile_idc & 0x1f),
                ...track.params.general_profile_compatibility_flags,
                ...track.params.general_constraint_indicator_flags,
                track.params.general_level_idc,
                0xf0 | ((track.params.min_spatial_segmentation_idc & 0x0f00) >> 8),
                track.params.min_spatial_segmentation_idc & 0xff,
                0xfc | (track.params.parallelism_type & 0x03),
                0xfc | (track.params.chroma_format_idc & 0x03),
                0xf8 | (track.params.bit_depth_luma_minus8 & 0x07),
                0xf8 | (track.params.bit_depth_chroma_minus8 & 0x07),
                0x00, 0x00, // avgFrameRate
                ((track.params.frame_rate.fixed & 0x03) << 6) | ((track.params.num_temporal_layers & 0x07) << 3) | ((track.params.temporal_id_nested ? 1 : 0) << 2) | 3,
                0x03, // numArrays
                ...new Uint8Array([
                    0x80 | 0x20, // NALU_TYPE_VPS_NUT
                    ...this.breakNumberIntoBytes(track.vps.length, 2),
                    ...this.breakNumberIntoBytes(track.vps[0].byteLength, 2), // TODO: all vps
                    ...track.vps[0],
                ]),
                ...new Uint8Array([
                    0x80 | 0x21, // NALU_TYPE_SPS_NUT,
                    ...this.breakNumberIntoBytes(track.sps.length, 2),
                    ...this.breakNumberIntoBytes(track.sps[0].byteLength, 2), // TODO: all sps
                    ...track.sps[0],
                ]),
                ...new Uint8Array([
                    0x80 | 0x22, // NALU_TYPE_PPS_NUT
                    ...this.breakNumberIntoBytes(track.pps.length, 2),
                    ...this.breakNumberIntoBytes(track.pps[0].byteLength, 2), // TODO: all pps
                    ...track.pps[0],
                ]),
            ]),
        );
        
        return MP4.box(
            MP4.types.hvc1,
            new Uint8Array([
                0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // data_reference_index
                0x00, 0x00, // pre_defined
                0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // pre_defined
                ...MP4.breakNumberIntoBytes(track.width, 2), // width
                ...MP4.breakNumberIntoBytes(track.height, 2), // height
                0x00, 0x48, 0x00, 0x00, // horizresolution
                0x00, 0x48, 0x00, 0x00, // vertresolution
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // frame_count
                0x09,
                0x6a, 0x6d, 0x75, 0x78, // jmuxer.js
                0x65, 0x72, 0x2e, 0x6a,
                0x73, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // compressorname
                0x18, // depth = 24
                0x11, 0x11, // pre_defined = -1
            ]),
            hvcc,
            MP4.box(
                MP4.types.btrt,
                new Uint8Array([
                    0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
                    0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
                    0x00, 0x2d, 0xc6, 0xc0, // avgBitrate
                ]),
            ),
            MP4.box(
                MP4.types.pasp,
                new Uint8Array([
                    ...MP4.breakNumberIntoBytes(track.pixelRatio[0], 4), // hSpacing
                    ...MP4.breakNumberIntoBytes(track.pixelRatio[1], 4), // vSpacing
                ]),
            ),
        );
    }
    
    static initSegment (tracks) {
        if (!MP4.types)
            MP4.init();
        
        const movie = MP4.moov(tracks);
        const result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
        result.set(MP4.FTYP);
        result.set(movie, MP4.FTYP.byteLength);
        
        return result;
    }
    
    static breakNumberIntoBytes (number, numBytes) {
        const bytes = [];
        for (let byte = numBytes - 1; byte >= 0; byte --) {
            bytes.push((number >> (8 * byte)) & 0xff);
        }
        return bytes;
    }
}

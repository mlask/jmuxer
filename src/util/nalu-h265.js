export class NALU {
	
	static get IDR_W_RADL () { return 19; }
	static get IDR_N_LP () { return 20; }
	static get VPS () { return 32; }
	static get SPS () { return 33; }
	static get PPS () { return 34; }
	static get AUD () { return 35; }
	static get EOS () { return 36; }
	static get EOB () { return 37; }
	static get FD () { return 38; }
	
	static get TYPES () {
		return {
			[NALU.VPS]: 'VPS',
			[NALU.SPS]: 'SPS',
			[NALU.PPS]: 'PPS',
			[NALU.AUD]: 'AUD',
			[NALU.EOS]: 'EOS',
			[NALU.EOB]: 'EOB',
			[NALU.FD]: 'FD',
		};
	}

	static type (nalu) {
		if (nalu.ntype in NALU.TYPES) {
			return NALU.TYPES[nalu.ntype];
		}
		else {
			return 'UNKNOWN';
		}
	}

	constructor (data) {
		this.payload = data;
		
		this.ntype = (this.payload[0] & 0x7e) >> 1; // nal_unit_type
		this.nlayerid = ((this.payload[0] & 0x01) << 6) | ((this.payload[1] & 0xf8) >> 3); // nuh_layer_id
		this.ntempidp = this.payload[1] & 0x07; // nuh_temporal_id_plus1
		
		this.isvcl = this.ntype >= 0 && this.ntype <= 31; // nal_unit_type is VCL?
		this.stype = ''; // slice_type
		this.isfmb = false; // first_mb_in_slice
	}
	
	toString () {
		return `${NALU.type(this)}: LayerId=${this.getLayerId()} TemporalId=${this.getTemporalId()}`;
	}

	getLayerId () {
		return this.nlayerid;
	}
	
	getTemporalId () {
		return this.ntempidp;
	}

	type () {
		return this.ntype;
	}

	isKeyframe () {
		return this.ntype === NALU.IDR_W_RADL || this.ntype === NALU.IDR_N_LP;
	}
	
	getPayload() {
		return this.payload;
	}

	getPayloadSize() {
		return this.payload.byteLength;
	}

	getSize() {
		return 4 + this.getPayloadSize();
	}

	getData() {
		const result = new Uint8Array(this.getSize());
		const view = new DataView(result.buffer);
		view.setUint32(0, this.getSize() - 4);
		result.set(this.getPayload(), 4);
		return result;
	}
}

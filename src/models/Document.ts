import type { AnyObject } from "./AnyObject";

export class Document {
	constructor(data: Document | AnyObject = {}) {
		this._load(data);
	}

	_load(data: Document | AnyObject) {
		if (data) {
			Object.assign(this, data);
		}
	}

	_collection = "";
	_dbFields: Array<string> = [];
	_id = "";
}

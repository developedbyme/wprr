import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import SingleLink from "wprr/utils/data/SingleLink";
export default class SingleLink extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._prefix = "group";
		this._id = null;
	}
	
	setId(aId) {
		this._id = aId;
		
		return this;
	}
	
	setPrefix(aPrefix) {
		this._prefix = aPrefix;
		
		return this;
	}
	
	get id() {
		return this._id;
	}
	
	get linkedItem() {
		
		let fullPath = this._id;
		if(this._prefix) {
			fullPath = this._prefix + "." + this._id;
		}
		
		return Wprr.objectPath(this.item, fullPath);
	}
	
	getAsType(aType) {
		
		return this.linkedItem.getType(aType);
	}
}
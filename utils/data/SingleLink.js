import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import SingleLink from "wprr/utils/data/SingleLink";
export default class SingleLink extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._prefix = "group";
		this._idSource = Wprr.sourceValue(null);
	}
	
	setId(aId) {
		this._idSource.value = aId;
		
		return this;
	}
	
	setPrefix(aPrefix) {
		this._prefix = aPrefix;
		
		return this;
	}
	
	set id(aValue) {
		this.setId(aValue);
	}
	
	get id() {
		return this._idSource.value;
	}
	
	get idSource() {
		return this._idSource;
	}
	
	get linkedItem() {
		
		if(!this.id) {
			return null;
		}
		
		let fullPath = this.id;
		if(this._prefix) {
			fullPath = this._prefix + "." + fullPath;
		}
		
		return Wprr.objectPath(this.item, fullPath);
	}
	
	get linkedUrlItem() {
		if(!this.id) {
			return null;
		}
		
		let from = this.item;
		if(this._prefix) {
			from = Wprr.objectPath(from, this._prefix);
		}
		
		return from.getItem(this.id);
	}
	
	getAsType(aType) {
		
		return this.linkedItem.getType(aType);
	}
}
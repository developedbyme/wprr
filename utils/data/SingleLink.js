import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import SingleLink from "wprr/utils/data/SingleLink";
export default class SingleLink extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._id = null;
	}
	
	setId(aId) {
		this._id = aId;
		
		return this;
	}
	
	get id() {
		return this._id;
	}
	
	get linkedItem() {
		return this.item.group.getItem(this._id);
	}
	
	getAsType(aType) {
		
		return this.linkedItem.getType(aType);
	}
}
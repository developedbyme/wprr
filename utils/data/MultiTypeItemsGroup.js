import Wprr from "wprr/Wprr";

import MultiTypeItem from "wprr/utils/data/MultiTypeItem";

// import MultiTypeItemsGroup from "wprr/utils/data/MultiTypeItemsGroup";
export default class MultiTypeItemsGroup {
	
	constructor() {
		this._prefix = "item";
		this._items = new Object();
	}
	
	get prefix() {
		return this._prefix;
	}
	
	set prefix(aValue) {
		this._prefix = aValue;
		
		return this._prefix;
	}
	
	getItem(aId) {
		//console.log("getItem");
		//console.log(aId);
		
		let nameWithPrefix = this._prefix + aId;
		
		if(!this._items[nameWithPrefix]) {
			this._items[nameWithPrefix] = MultiTypeItem.create(aId);
		}
		
		return this._items[nameWithPrefix];
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = aPath.split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "prefix":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.getItem(firstPart), restParts);
	}
}
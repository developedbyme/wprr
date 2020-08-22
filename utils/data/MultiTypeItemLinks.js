import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import MultiTypeItemLinks from "wprr/utils/data/MultiTypeItemLinks";
export default class MultiTypeItemLinks extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._ids = new Array();
	}
	
	get ids() {
		return this._ids;
	}
	
	addItem(aId) {
		this._ids.push(aId);
		
		return this;
	}
	
	createItem(aId) {
		let item = this.item.group.getItem(aId);
		this.addItem(aId);
		
		return item;
	}
	
	get items() {
		let returnArray = new Array();
		let group = this.item.group;
		
		let currentArray = this._ids;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(group.getItem(currentArray[i]));
		}
		
		return returnArray;
	}
	
	getAsType(aType) {
		
		let returnArray = new Array();
		
		let fields = this.items;
		
		let currentArray = fields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			returnArray.push(currentItem.getType(aType));
		}
		
		return returnArray;
	}
}
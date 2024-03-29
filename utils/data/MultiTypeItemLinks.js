import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import MultiTypeItemLinks from "wprr/utils/data/MultiTypeItemLinks";
export default class MultiTypeItemLinks extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._idsSource = Wprr.sourceValue(new Array());
	}
	
	get ids() {
		return this._idsSource.value;
	}
	
	get idsSource() {
		return this._idsSource;
	}
	
	addItem(aId) {
		
		let newArray = [].concat(this._idsSource.value);
		newArray.push(aId);
		
		this._idsSource.value = newArray;
		this._idsSource.updateForValueChange();
		
		return this;
	}
	
	insertItem(aId, aPosition) {
		
		let newArray = [].concat(this._idsSource.value);
		
		if(aPosition === -1) {
			aPosition = newArray.length;
		}
		
		newArray.splice(aPosition, 0, aId);
		
		this._idsSource.value = newArray;
		this._idsSource.updateForValueChange();
		
		return this;
	}
	
	addUniqueItem(aId) {
		if(this._idsSource.value.indexOf(aId) === -1) {
			this.addItem(aId);
		}
		
		return this;
	}
	
	hasItem(aId) {
		return (this._idsSource.value.indexOf(aId) === -1);
	}
	
	removeItem(aId) {
		//console.log("removeItem");
		//console.log(this._idsSource.value, aId);
		
		let newArray = [].concat(this._idsSource.value);
		
		let index = newArray.indexOf(aId);
		if(index > -1) {
			newArray.splice(index, 1);
			
			this._idsSource.value = newArray;
			this._idsSource.updateForValueChange();
		}
	}
	
	addItems(aIds) {
		//console.log("addItems");
		
		let currentItems = [].concat(this._idsSource.value);
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			currentItems.push(currentArray[i]);
		}
		
		this._idsSource.value = currentItems;
		this._idsSource.updateForValueChange();
		
		return this;
	}
	
	addUniqueItems(aIds) {
		let currentItems = [].concat(this._idsSource.value);
		let hasChange = false;
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			if(currentItems.indexOf(currentId) === -1) {
				currentItems.push(currentId);
				hasChange = true;
			}
		}
		
		if(hasChange) {
			this._idsSource.value = currentItems;
			this._idsSource.updateForValueChange();
		}
		
		return this;
	}
	
	setItems(aIds) {
		this._idsSource.value = [].concat(aIds);
	}
	
	createItem(aId) {
		let item = this.item.group.getItem(aId);
		this.addItem(aId);
		
		return item;
	}
	
	get items() {
		let returnArray = new Array();
		let group = this.item.group;
		
		let currentArray = this._idsSource.value;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(group.getItem(currentArray[i]));
		}
		
		return returnArray;
	}
	
	input(aValue) {
		this.idsSource.input(aValue);
		
		return this;
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
	
	removeAll() {
		let currentArray = this._idsSource.value;
		currentArray.splice(0, currentArray.length);
		this._idsSource.externalDataChange();
		
		return this;
	}
}
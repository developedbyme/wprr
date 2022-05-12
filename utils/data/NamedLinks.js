import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import NamedLinks from "wprr/utils/data/NamedLinks";
export default class NamedLinks extends MultiTypeItemConnection {
	
	constructor() {
		super();
		
		this._namesSource = Wprr.sourceValue(new Array());
		this._idsSource = Wprr.sourceValue(new Array());
	}
	
	get names() {
		return this._namesSource.value;
	}
	
	get ids() {
		return this._idsSource.value;
	}
	
	get idsSource() {
		return this._idsSource;
	}
	
	addItem(aName, aId) {
		this._namesSource.value.push(aName);
		this._idsSource.value.push(aId);
		
		this._namesSource.externalDataChange();
		this._idsSource.externalDataChange();
		
		return this;
	}
	
	removeItem(aId) {
		let index = this._idsSource.value.indexOf(aId);
		if(index > -1) {
			this._namesSource.value.splice(index, 1);
			this._idsSource.value.splice(index, 1);
			
			this._namesSource.externalDataChange();
			this._idsSource.externalDataChange();
		}
	}
	
	addItems(aKeyValueItems) {
		
		let currentArray = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(dataSettings);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			let currentName = currentItem["key"];
			
			this.addItem(currentName, currentItem["value"]);
			
			names.push(currentName);
		}
		
		return this;
	}
	
	createItem(aName, aId) {
		let item = this.item.group.getItem(aId);
		this.addItem(aName, aId);
		
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
	
	getLinkByName(aName) {
		let index = this._namesSource.value.indexOf(aName);
		if(index === -1) {
			console.warn("No link named " + aName, this);
			return null;
		}
		
		let group = this.item.group;
		return group.getItem(this._idsSource.value[index]);
	}
	
	hasLinkByName(aName) {
		let index = this._namesSource.value.indexOf(aName);
		
		return (index !== -1);
	}
	
	removeAll() {
		this._namesSource.value.splice(0, currentArray.length);
		this._idsSource.value.splice(0, currentArray.length);
		
		this._namesSource.externalDataChange();
		this._idsSource.externalDataChange();
		
		return this;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "item":
			case "items":
			case "names":
			case "ids":
			case "idsSource":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.getLinkByName(firstPart), restParts);
	}
}
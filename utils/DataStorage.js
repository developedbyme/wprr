import objectPath from "object-path";

// import DataStorage from "wprr/utils/DataStorage";
export default class DataStorage {
	
	constructor() {
		this.setData(new Object());
		
		this._owners = new Array();
	}
	
	setData(aData) {
		this._data = aData;
	}
	
	getData() {
		return this._data;
	}
	
	addOwner(aOwner) {
		this._owners.push(aOwner);
	}
	
	removeOwner(aOwner) {
		let currentIndex = this._owners.indexOf(aOwner);
		if(currentIndex !== -1) {
			this._owners.splice(currentIndex, 1);
		}
	}
	
	_updateOwners() {
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			currentOwner.externalDataChange();
		}
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/DataStorage::updateValue");
		objectPath.set(this._data, aName, aValue);
		this._updateOwners();
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/DataStorage::getValue");
		
		return objectPath.get(this._data, aName);
	}
}
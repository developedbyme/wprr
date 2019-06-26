import objectPath from "object-path";

// import DataStorage from "wprr/utils/DataStorage";
export default class DataStorage {
	
	constructor() {
		this.setData(new Object());
		
		this._owners = new Array();
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	setData(aData) {
		this._data = aData;
		
		return this;
	}
	
	getData() {
		return this._data;
	}
	
	addOwner(aOwner) {
		this._owners.push(aOwner);
		
		return this;
	}
	
	removeOwner(aOwner) {
		//console.log("wprr/utils/DataStorage::removeOwner");
		//console.log(aOwner);
		
		let currentIndex = this._owners.indexOf(aOwner);
		if(currentIndex !== -1) {
			this._owners.splice(currentIndex, 1);
		}
		
		return this;
	}
	
	_updateOwners() {
		//console.log("wprr/utils/DataStorage::_updateOwners");
		//console.log(this._owners);
		//METODO: need this to be safe for removing or adding owners in the middle of an update
		
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			if(currentOwner) { //METODO: improve this to have a safe array
				currentOwner.externalDataChange();
			}
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
	
	addValueToArray(aName, aValue) {
		
		let currentArray = [].concat(this.getValue(aName));
		currentArray.push(aValue);
		this.updateValue(aName, currentArray);
		
		return this;
	}
	
	getValueForPath(aPath) {
		switch(aPath) {
			case "getValue":
				return this.getValue;
			case "updateValue":
				return this.updateValue;
		}
		
		return this.getValue(aPath);
	}
}
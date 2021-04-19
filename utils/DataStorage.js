import Wprr from "wprr/Wprr";

import objectPath from "object-path";

import AbstractDataStorage from "wprr/utils/AbstractDataStorage";

import DataStorageConnection from "wprr/utils/DataStorageConnection";
import DataStorageChangeCommands from "wprr/utils/DataStorageChangeCommands";

// import DataStorage from "wprr/utils/DataStorage";
export default class DataStorage extends AbstractDataStorage {
	
	constructor() {
		
		super();
		
		this.setData(new Object());
		
		this._owners = new Array();
		this._enableUpdates = true;
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
	
	disableUpdates() {
		this._enableUpdates = false;
		
		return this;
	}
	
	enableUpdates(aUpdateOwners = false) {
		this._enableUpdates = true;
		
		if(aUpdateOwners) {
			this._updateOwners();
		}
		
		return this;
	}
	
	_updateOwners(aName = null) {
		//console.log("wprr/utils/DataStorage::_updateOwners");
		//console.log(this._owners);
		//METODO: need this to be safe for removing or adding owners in the middle of an update
		
		if(!this._enableUpdates) {
			return;
		}
		
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			if(currentOwner) { //METODO: improve this to have a safe array
				currentOwner.externalDataChange(aName);
			}
		}
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/DataStorage::updateValue");
		//console.log(aName, aValue);
		let oldValue = this.getValue(aName);
		
		let shouldUpdate = false;
		
		if(Wprr.development_skipDataStorageComparison) {
			shouldUpdate = true;
		}
		else {
			let type = typeof(aValue);
			if(type === "object") {
				
				if(!oldValue) {
					shouldUpdate = true;
				}
				else {
					if(Array.isArray(aValue) && Array.isArray(oldValue) && aValue.length !== oldValue.length) {
						shouldUpdate = true;
					}
					else {
						console.log(type, aValue, oldValue);
						try {
							if(JSON.stringify(aValue) !== JSON.stringify(oldValue)) {
								shouldUpdate = true;
							}
						}
						catch(theError) {
							shouldUpdate = true;
						}
					}
				}
			}
			else {
				if(aValue !== oldValue ) {
					shouldUpdate = true;
				}
			}
		}
		
		if(shouldUpdate) {
			objectPath.set(this._data, aName, aValue);
			this._updateOwners(aName);
		}
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/DataStorage::getValue");
		
		return Wprr.objectPath(this._data, aName);
	}
	
	addValueToArray(aName, aValue) {
		
		let currentValue = this.getValue(aName);
		if(!currentValue) {
			currentValue = new Array();
		}
		
		let currentArray = [].concat(currentValue);
		currentArray.push(aValue);
		this.updateValue(aName, currentArray);
		
		return this;
	}
	
	removeValueFromArray(aName, aValue) {
		
		let currentArray = [].concat(this.getValue(aName));
		let index = currentArray.indexOf(aValue);
		if(index >= 0) {
			currentArray.splice(index, 1);
			this.updateValue(aName, currentArray);
		}
		
		return this;
	}
	
	getValueForPath(aPath) {
		switch(aPath) {
			case "getValue":
				return this.getValue;
			case "updateValue":
				return this.updateValue;
			case "createConnection":
				return this.createConnection;
		}
		
		return this.getValue(aPath);
	}
	
	createConnection(aPrefix = null, aSuffix = null) {
		let newDataStorageConnection = new DataStorageConnection();
		
		newDataStorageConnection.setDataStorage(this);
		newDataStorageConnection.setup(aPrefix, aSuffix);
		
		return newDataStorageConnection;
	}
	
	createChangeCommands(aValueNames, aPerformingObject, aCommands = null) {
		let newDataStorageChangeCommands = new DataStorageChangeCommands();
		
		newDataStorageChangeCommands.setDataStorage(this);
		newDataStorageChangeCommands.setup(aValueNames, aPerformingObject);
		newDataStorageChangeCommands.setCommands(aCommands);
		
		return newDataStorageChangeCommands;
	}
}
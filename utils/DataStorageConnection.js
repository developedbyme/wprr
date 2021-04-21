import Wprr from "wprr/Wprr";

import objectPath from "object-path";

import AbstractDataStorage from "wprr/utils/AbstractDataStorage";

// import DataStorageConnection from "wprr/utils/DataStorageConnection";
export default class DataStorageConnection extends AbstractDataStorage {
	
	constructor() {
		
		super();
		
		this._prefix = "";
		this._suffix = "";
		
		this._dataStorage = null;
	}
	
	setDataStorage(aDataStorage) {
		this._dataStorage = aDataStorage;
		
		return this;
	}
	
	setup(aPrefix = null, aSuffix = null) {
		if(aPrefix !== null) {
			this._prefix = aPrefix + ".";
		}
		if(aSuffix !== null) {
			this._suffix = "." + aSuffix;
		}
		
		return this;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	addOwner(aOwner) {
		this._dataStorage.addOwner(aOwner);
		
		return this;
	}
	
	removeOwner(aOwner) {
		this._dataStorage.removeOwner(aOwner);
		
		return this;
	}
	
	getFullName(aName) {
		return this._prefix + aName + this._suffix;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/DataStorageConnection::updateValue");
		//console.log(aName, aValue);
		
		this._dataStorage.updateValue(this.getFullName(aName), aValue);
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/DataStorageConnection::getValue");
		
		return this._dataStorage.getValue(this.getFullName(aName));
	}
	
	getData() {
		if(!this._prefix) {
			return this._dataStorage.getData();
		}
		let prefixPath = this._prefix.substring(0, this._prefix.length-1);
		return this._dataStorage.getValue(prefixPath);
	}
	
	addValueToArray(aName, aValue) {
		
		this._dataStorage.addValueToArray(this.getFullName(aName), aValue);
		
		return this;
	}
	
	removeValueFromArray(aName, aValue) {
		
		this._dataStorage.removeValueFromArray(this.getFullName(aName), aValue);
		
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
		//console.log("createChangeCommands");
		//console.log(aValueNames, aPerformingObject, aCommands);
		
		aValueNames = Wprr.utils.array.arrayOrSeparatedString(aValueNames);
		let aFullValueNames = aValueNames.map(this.getFullName.bind(this));
		
		return this._dataStorage.createChangeCommands(aFullValueNames, aPerformingObject, aCommands);
	}
}
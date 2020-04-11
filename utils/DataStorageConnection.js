import Wprr from "wprr/Wprr";

import objectPath from "object-path";

// import DataStorageConnection from "wprr/utils/DataStorageConnection";
export default class DataStorageConnection {
	
	constructor() {
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
		
		this._dataStorage.updateValue(this.getFullName(aName), aValue);
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/DataStorageConnection::getValue");
		
		return this._dataStorage.getValue(this.getFullName(aName));
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
}
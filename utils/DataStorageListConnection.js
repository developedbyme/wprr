import Wprr from "wprr/Wprr";

import objectPath from "object-path";

import DataStorageConnection from "wprr/utils/DataStorageConnection";

// import DataStorageListConnection from "wprr/utils/DataStorageListConnection";
export default class DataStorageListConnection {
	
	constructor() {
		
		this._idPrefix = "id";
		this._currentId = 1;
		
		this._prefix = "";
		this._suffix = null;
		this._listName = "list";
		
		this._dataStorage = null;
		
		this.connections = new Object();
		this.items = new Object();
	}
	
	setDataStorage(aDataStorage) {
		this._dataStorage = aDataStorage;
		
		//METODO: loop over all connections and set the data storage
		
		return this;
	}
	
	setup(aListName = null, aPrefix = null, aSuffix = null) {
		if(aListName !== null) {
			this._listName = aListName;
		}
		if(aPrefix !== null) {
			this._prefix = aPrefix + ".";
		}
		if(aSuffix !== null) {
			this._suffix = aSuffix;
		}
		
		return this;
	}
	
	getFullName(aName) {
		return this._prefix + aName + this._suffix;
	}
	
	createConnection() {
		let newId = this._idPrefix + this._currentId;
		this._currentId++;
		
		let connection = new DataStorageConnection();
		connection.setDataStorage(this._dataStorage);
		connection.setup(this._prefix + newId, this._suffix);
		
		this.connections[newId] = connection;
		
		return newId;
	}
	
	addItemWithId(aItem, aId) {
		this.items[aId] = aItem;
		
		let list = [].concat(this._dataStorage.getValue(this._listName));
		list.push(aId);
		this._dataStorage.updateValue(this._listName, list);
		
		return this;
	}
	
	addItem(aItem) {
		let newId = this.createConnection();
		this.addItemWithId(aItem, newId);
		
		return newId;
	}
	
	getConnection(aId) {
		//METODO: check that item exists
		return this.connections[aId];
	}
	
	getItem(aId) {
		//METODO: check that item exists
		return this.items[aId];
	}
	
	identifyItem(aItem) {
		return Wprr.utils.object.identifyProperty(this.items, aItem);
	}
	
	removeItemById(aId) {
		delete this.items[aId];
		delete this.connections[aId];
		
		let list = [].concat(this._dataStorage.getValue(this._listName));
		let index = list.indexOf(aId);
		if(index >= 0) {
			list.splice(index, 1);
			this._dataStorage.updateValue(this._listName, list);
		}
		
	}
}
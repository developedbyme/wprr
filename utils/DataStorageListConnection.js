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
		this._hierarchyName = null;
		
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
	
	setHierarcyName(aHierarcyName) {
		
		this._hierarchyName = aHierarcyName;
		
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
	
	addItemWithId(aItem, aId, aParentName = "main") {
		this.items[aId] = aItem;
		
		let list = this._dataStorage.getValue(this._listName);
		if(!list) {
			list = new Array();
		}
		list = [].concat(list);
		list.push(aId);
		
		this._dataStorage.updateValue(this._listName, list);
		if(this._hierarchyName) {
			let currentListName = this._hierarchyName + "." + aParentName;
			
			let hierarchyList = this._dataStorage.getValue(currentListName);
			if(!hierarchyList) {
				hierarchyList = new Array();
			}
			hierarchyList = [].concat(hierarchyList);
			hierarchyList.push(aId);
			
			this._dataStorage.updateValue(this._hierarchyName + ".parents." + aId, aParentName);
			this._dataStorage.updateValue(currentListName, hierarchyList);
		}
		
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
		
		if(this._hierarchyName) {
			let parentName = this._dataStorage.getValue(this._hierarchyName + ".parents." + aId);
			//METODO: delete this value
			
			let currentListName = this._hierarchyName + "." + parentName;
			let hierarchyList = [].concat(this._dataStorage.getValue(currentListName));
			let index = hierarchyList.indexOf(aId);
			if(index >= 0) {
				hierarchyList.splice(index, 1);
				this._dataStorage.updateValue(currentListName, hierarchyList);
			}
		}
	}
	
	_orderMainListAfterHierarchy() {
		//METODO
	}
	
	changeItemParent(aId, aParentName, insertAtPosition = -1) {
		if(this._hierarchyName) {
			let lastParentName = this._dataStorage.getValue(this._hierarchyName + ".parents." + aId);
			
			if(lastParentName !== aParentName) {
				let listName = this._hierarchyName + "." + aParentName;
				let lastListName = this._hierarchyName + "." + lastParentName;
				let lastList = [].concat(this._dataStorage.getValue(lastListName));
				let index = lastList.indexOf(aId);
				if(index >= 0) {
					lastList.splice(index, 1);
					this._dataStorage.updateValue(lastListName, lastList);
				}
				
				let list = [].concat(this._dataStorage.getValue(listName));
				list.push(aId);
				this._dataStorage.updateValue(listName, list);
			}
			
			this._dataStorage.updateValue(this._hierarchyName + ".parents." + aId, aParentName);
		}
		
		this._orderMainListAfterHierarchy();
		
		return this;
	}
	
	collectList() {
		let returnArray = new Array();
		
		return returnArray;
	}
	
	_collectHierarchyList(aIds) {
		
		let returnArray = new Array();
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			let connection = this.getConnection(currentId);
			let currentData = {"data": connection.getData()};
			
			let children = this._dataStorage.getValue(this._hierarchyName + "." + currentId);
			if(children) {
				currentData["children"] = this._collectHierarchyList(children);
			}
			returnArray.push(currentData);
		}
		
		return returnArray;
	}
	
	collectStructure() {
		if(!this._hierarchyName) {
			return this.collectList();
		}
		
		let mainList = this._dataStorage.getValue(this._hierarchyName + ".main");
		if(mainList) {
			return this._collectHierarchyList(mainList);
		}
		
		return new Array();
	}
}
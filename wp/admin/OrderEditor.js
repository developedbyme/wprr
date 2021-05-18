import React from 'react';
import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import OrderEditor from "wprr/wp/admin/OrderEditor";
export default class OrderEditor extends MultiTypeItemConnection {

	constructor() {
		
		super();
		
		this._orderNames = new Array();
		this._commands = Wprr.utils.InputDataHolder.create();
	}
	
	get externalStorage() {
		return this.item.getType("orderStorage");
	}
	
	addCommand(aName, aCommand) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		//METODO: we just assumes that it is an array
		this._commands.getRawInput(aName).push(aCommand);
		
		return this;
	}
	
	getHierarchyForOrder(aName) {
		console.log("getHierarchyForOrder");
		
		let links = this.item.getNamedLinks("orderHierarchies");
		
		if(!links.hasLinkByName(aName)) {
			let hierarchyItem = this.item.group.createInternalItem();
			
			let hierarchy = new Wprr.utils.Hierarchy();
			hierarchyItem.addType("hierarchy", hierarchy);
			
			let editStorage = this.item.getType("orderStorage");
			let currentData = editStorage.getValue(aName);
			
			hierarchy.setup(currentData);
			
			hierarchy.sources.get("structure").connectExternalStorage(this.item.getType("orderStorage"), aName);
			hierarchy.sources.get("structure").addChangeCommand(Wprr.commands.callFunction(this, this._changed));
			
			links.addItem(aName, hierarchyItem.id);
		}
		
		return links.getLinkByName(aName);
	}
	
	addOrder(aName, aInitialItems = null) {
		if(this._orderNames.indexOf(aName) !== -1) {
			console.warn("Order " + aName + " already exists");
			return this;
		}
		
		let storeArray = new Array();
		if(aInitialItems) {
			let currentArray = aInitialItems;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				storeArray.push(currentItem);
			}
		}
		
		this._orderNames.push(aName);
		
		let editStorage = this.item.getType("orderStorage");
		editStorage.updateValue(aName, storeArray);
		editStorage.updateValue("saved." + aName, storeArray.concat([]));
		
		this._changed();
	}
	
	ensureOrderExists(aName) {
		if(this._orderNames.indexOf(aName) === -1) {
			
			this._orderNames.push(aName);
			
			let editStorage = this.item.getType("orderStorage");
			editStorage.updateValue(aName, []);
			editStorage.updateValue("saved." + aName, []);
		}
		
		return this;
	}
	
	setOrder(aName, aItems) {
		//console.log("setOrder");
		//console.log(aName, aItems);
		
		this.ensureOrderExists(aName);
		
		let editStorage = this.item.getType("orderStorage");
		editStorage.updateValue(aName, [].concat(aItems));
		
		return this;
	}
	
	moveUp(aName, aItem) {
		//console.log("moveUp");
		
		this.ensureOrderExists(aName);
		
		let editStorage = this.item.getType("orderStorage");
		let items = [].concat(editStorage.getValue(aName));
		
		let index = items.indexOf(aItem);
		if(index !== -1) {
			if(index > 0) {
				let temp = items[index-1];
				items[index-1] = aItem;
				items[index] = temp;
			}
		}
		
		editStorage.updateValue(aName, items);
		this._changed();
		
		return this;
	}
	
	moveDown(aName, aItem) {
		//console.log("moveDown");
		
		this.ensureOrderExists(aName);
		
		let editStorage = this.item.getType("orderStorage");
		let items = [].concat(editStorage.getValue(aName));
		
		let index = items.indexOf(aItem);
		if(index !== -1) {
			if(index < items.length-1) {
				let temp = items[index+1];
				items[index+1] = aItem;
				items[index] = temp;
			}
		}
		
		editStorage.updateValue(aName, items);
		this._changed();
		
		return this;
	}
	
	hasUnsavedChanges() {
		console.log("hasUnsavedChanges");
		
		let editStorage = this.item.getType("orderStorage");
		
		let currentArray = this._orderNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let fieldName = currentArray[i];
			
			let newValue = editStorage.getValue(fieldName);
			let oldValue = editStorage.getValue("saved." + fieldName);
			if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
				return true;
			}
		}
		
		return false;
	}
	
	getSaveData() {
		let saveData = Wprr.wp.admin.SaveData.create(this.item.id);
		
		let editStorage = this.item.getType("orderStorage");
		
		let currentArray = this._orderNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let fieldName = currentArray[i];
			
			saveData.changes.createChange("dbm/order", {"value": editStorage.getValue(fieldName), "forType": fieldName});
			saveData.addUpdateSavedFieldCommand(fieldName, editStorage);
		}
		
		return saveData;
	}
	
	getSaveDatas() {
		
		if(!this.hasUnsavedChanges()) {
			return [];
		}
		
		let returnData = this.getSaveData();
		
		return [returnData];
	}
	
	_changed() {
		//console.log("_changed");
		
		let commandName = "changed";
		if(this._commands.hasInput(commandName)) {
			Wprr.utils.CommandPerformer.perform(this._commands.getInput(commandName, {}, this), null, this);
		}
	}
}

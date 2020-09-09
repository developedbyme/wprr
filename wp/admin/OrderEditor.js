import React from 'react';
import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import OrderEditor from "wprr/wp/admin/OrderEditor";
export default class OrderEditor extends MultiTypeItemConnection {

	constructor() {
		
		super();
		
		this._orderNames = new Array();
	}
	
	get externalStorage() {
		return this.item.getType("orderStorage");
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
			
			console.log(fieldName, editStorage.getValue(fieldName));
			
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
		console.log(">", returnData);
		
		return [returnData];
	}
}

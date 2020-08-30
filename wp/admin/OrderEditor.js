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
		
		let editStorage = this.item.getType("orderStorage");
		editStorage.updateValue(aName, storeArray);
		editStorage.updateValue("saved." + aName, storeArray.concat([]));
	}
	
	hasUnsavedChanges() {
		console.log("hasUnsavedChanges");
		
		let editStorage = this.item.getType("orderStorage");
		
		let currentArray = this._orderNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			let fieldName = currentField["field"];
			
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
		let currentArray = this._orderNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			
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

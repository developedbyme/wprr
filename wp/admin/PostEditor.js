import React from 'react';
import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

//import PostEditor from "wprr/wp/admin/PostEditor";
export default class PostEditor extends MultiTypeItemConnection {

	constructor() {
		
		super();
		
		this._changeFields = new Array();
	}
	
	addField(aName, aValue, aSaveType = "meta", aChangeGenerator = null) {
		
		//METODO: check if field is already added
		
		this._changeFields.push({"field": aName, "saveType": aSaveType, "changeGenerator": aChangeGenerator});
		
		this.item.getType("editStorage").updateValue(aName, aValue);
		this.item.getType("editStorage").updateValue("saved." + aName, aValue);
		
		
		this.item.getType("editStorage").createChangeCommands([aName, "saved." + aName], null, this.item.getType("dataChangeCommands"))
		
		return this;
	}
	
	updateField(aName, aValue) {
		this.item.getType("editStorage").updateValue(aName, aValue);
		
		return this;
	}
	
	hasUnsavedChanges() {
		console.log("hasUnsavedChanges");
		
		let editStorage = this.item.getType("editStorage");
		
		let currentArray = this._changeFields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			let fieldName = currentField["field"];
			
			let newValue = editStorage.getValue(fieldName);
			let oldValue = editStorage.getValue("saved." + fieldName);
			console.log(newValue, oldValue);
			if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
				return true;
			}
		}
		
		return false;
	}
	
	getFieldSettings(aFieldName) {
		return Wprr.utils.array.getItemBy("field", aFieldName, this._changeFields);
	}
	
	_addFieldChange(aField, aValue, aSaveData) {
		
		let changeData;
		if(aField["changeGenerator"]) {
			let data = aField["changeGenerator"];
			
			if(data instanceof SourceData) {
				let changePropsAndStateObject = {"props": {}, "state": {}, "event": aValue};
				
				data = aData.getSourceInStateChange(null, changePropsAndStateObject);
			}
			
			changeData = data;
		}
		else {
			changeData = {"value": aValue, "field": aField["field"]};
		}
		
		aSaveData.changes.createChange(aField["saveType"], changeData);
		aSaveData.addUpdateSavedFieldCommand(aField["field"], this.item.getType("editStorage"));
	}
	
	_getSaveDataForField(aFieldName, aSaveData) {
		let editStorage = this.item.getType("editStorage");
		
		let newValue = editStorage.getValue(aFieldName);
		let oldValue = editStorage.getValue("saved." + aFieldName);
		if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
			this._addFieldChange(this.getFieldSettings(aFieldName), newValue, aSaveData);
		}
	}
	
	getSaveDataForField(aFieldName) {
		let saveData = Wprr.wp.admin.SaveData.create(this.item.id);
		
		this._getSaveDataForField(aFieldName, saveData);
		
		return saveData;
	}
	
	getSaveData() {
		let saveData = Wprr.wp.admin.SaveData.create(this.item.id);
		let currentArray = this._changeFields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			this._getSaveDataForField(currentField["field"], saveData);
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

import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

export default class InternalMessageGroup {
	
	constructor() {
		this._id = 0;
		this._fields = new Object();
		this._messages = new Array();
	}
	
	setId(aId) {
		this._id = aId;
		
		return this._id;
	}
	
	getField(aName) {
		return this._fields[aName];
	}
	
	setupFields(aFieldsData) {
		let currentArray = aFieldsData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentFieldData = currentArray[i];
			let newField = new Wprr.utils.wp.dbmcontent.im.TimelineField();
			
			let key = keyValue["key"];
			
			newField.setMessageGroup(this);
			newField.setupField(key, objectPath.get(currentFieldData["type"], "slug"), objectPath.get(currentFieldData["status"], "slug"), currentFieldData.settings);
			newField.setValue(currentFieldData["value"]);
			newField.setupChanges(currentFieldData["pastChanges"], currentFieldData["futureChanges"]);
			
			this._fields["key"] = newField;
		}
		
		return this;
	}
	
	saveAllFields() {
		//METODO
	}
	
	saveField(aFieldName) {
		//METODO
	}
	
}
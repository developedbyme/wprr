import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

export default class InternalMessageGroup {
	
	constructor() {
		
		this._id = 0;
		this._fields = new Object();
		this._messages = new Array();
	}
	
	setup(aData) {
		console.log("InternalMessageGroup::setup");
		console.log(aData);
		
		this.setId(aData["id"]);
		if(aData["fields"]) {
			this.setupFields(aData["fields"]);
		}
		if(aData["messages"]) {
			//METODO
			//this.setupMessages(aData["messages"]);
		}
		
		return this;
	}
	
	connectToEditStorage(aExternalStorage) {
		console.log("InternalMessageGroup::connectToEditStorage");
		console.log(aExternalStorage);
		
		let id = this.getId();
		let prefix = "item" + id + ".fields.";
		
		console.log(this._fields);
		for(let objectName in this._fields) {
			let field = this._fields[objectName];
			
			let connection = aExternalStorage.createConnection(prefix + objectName);
			field.connectToEditStorage(connection);
		}
		
		return this;
	}
	
	setId(aId) {
		this._id = aId;
		
		return this;
	}
	
	getId() {
		return this._id;
	}
	
	getField(aName) {
		return this._fields[aName];
	}
	
	getFieldValue(aName) {
		
		let field = this.getField(aName);
		if(field) {
			return field.getValue();
		}
		
		return null;
	}
	
	setupFields(aFieldsData) {
		console.log("InternalMessageGroup::setupFields");
		console.log(aFieldsData);
		
		let currentArray = aFieldsData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentFieldData = currentArray[i];
			let newField = new Wprr.utils.wp.dbmcontent.im.TimelineField();
			
			let key = currentFieldData["key"];
			
			newField.setMessageGroup(this);
			newField.setupField(key, objectPath.get(currentFieldData["type"], "slug"), objectPath.get(currentFieldData["status"], "slug"), currentFieldData.settings);
			newField.setValue(currentFieldData["value"]);
			//METODO: setup translations
			if(currentFieldData["pastChanges"] || currentFieldData["futureChanges"]) {
				newField.setupChanges(currentFieldData["pastChanges"], currentFieldData["futureChanges"]);
			}
			
			this._fields[key] = newField;
		}
		
		return this;
	}
	
	saveAllFields() {
		//METODO
	}
	
	saveField(aFieldName) {
		//METODO
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		console.log("InternalMessageGroup::getValueForPath");
		console.log(aPath);
		
		switch(aPath) {
			case "id":
				return this.getId();
			case "getField":
				return this.getField;
			case "getFieldValue":
				return this.getFieldValue;
		}
		
		return this.getFieldValue(aPath);
	}
}
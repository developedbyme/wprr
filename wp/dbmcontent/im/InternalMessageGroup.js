import Wprr from "wprr/Wprr";
import React from "react";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import CommandPerformer from "wprr/commands/CommandPerformer";
import InputDataHolder from "wprr/utils/InputDataHolder";

export default class InternalMessageGroup extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._id = 0;
		this._messages = new Array();
		
		this._commands = InputDataHolder.create();
	}
	
	setup(aData) {
		//console.log("InternalMessageGroup::setup");
		//console.log(aData);
		
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
	
	setupFieldEditStorages() {
		let currentArray = this.getFields();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let field = currentArray[i];
			
			field.setupEditStorage();
		}
		
		return this;
	}
	
	connectToEditStorage(aExternalStorage) {
		//console.log("InternalMessageGroup::connectToEditStorage");
		//console.log(aExternalStorage);
		
		let id = this.getId();
		let prefix = "items.item" + id + ".fields.";
		
		let currentArray = this.getFields();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let field = currentArray[i];
			
			let connection = aExternalStorage.createConnection(prefix + field.key);
			field.connectToEditStorage(connection);
		}
		
		return this;
	}
	
	addCommand(aName, aCommand) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		//METODO: we just assumes that it is an array
		this._commands.getRawInput(aName).push(aCommand);
		
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
		
		let fields = this.getFields();
		
		return Wprr.utils.array.getItemBy("key", aName, fields);
	}
	
	updateField(aName, aValue) {
		let field = this.getField(aName);
		if(!field) {
			console.error("No field named " + aName + ", can't set value", aValue);
			return this;
		}
		
		field.setValue(aValue);
		
		return this;
	}
	
	getFieldValue(aName) {
		
		let field = this.getField(aName);
		if(field) {
			return field.getValue();
		}
		
		return null;
	}
	
	setupFields(aFieldsData) {
		//console.log("InternalMessageGroup::setupFields");
		//console.log(aFieldsData);
		
		let group = this.item.group;
		let fieldLinks = this.item.getLinks("fields");
		let fieldSelect = this.item.addSelectLink("fieldByName", "fields", "field.key");
		
		let currentArray = aFieldsData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentFieldData = currentArray[i];
			let newField = new Wprr.utils.wp.dbmcontent.im.TimelineField();
			
			let item = fieldLinks.createItem(group.generateNextInternalId());
			item.addType("field", newField);
			item.addType("parentItem", this.item);
			
			let key = currentFieldData["key"];
			
			newField.setMessageGroup(this);
			newField.setupField(key, objectPath.get(currentFieldData["type"], "slug"), objectPath.get(currentFieldData["status"], "slug"), currentFieldData.settings);
			newField.setValue(currentFieldData["value"]);
			if(currentFieldData["translations"]) {
				newField.setTranslations(currentFieldData["translations"]);
			}
			if(currentFieldData["pastChanges"] || currentFieldData["futureChanges"]) {
				newField.setupChanges(currentFieldData["pastChanges"], currentFieldData["futureChanges"]);
			}
		}
		
		return this;
	}
	
	getFields() {
		return this.item.getType("fields").getAsType("field");
	}
	
	getFieldNames() {
		
		let fields = this.getFields();
		
		return Wprr.utils.array.mapField(fields, "key");
	}
	
	hasUnsavedChanges() {
		
		let currentArray = this.getFields();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(currentArray[i].hasUnsavedChange()) {
				return true;
			}
		}
		
		return false;
	}
	
	getFieldsToSave() {
		
		let returnArray = new Array();
		
		let currentArray = this.getFields();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let field = currentArray[i];
			if(field.hasUnsavedChange()) {
				returnArray.push(field);
			}
		}
		
		return returnArray;
	}
	
	fieldChanged(aField) {
		let commandName = "fieldChange";
		if(this._commands.hasInput(commandName)) {
			CommandPerformer.perform(this._commands.getInput(commandName, {}, this), aField, this);
		}
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
		//console.log("InternalMessageGroup::getValueForPath");
		//console.log(aPath);
		
		switch(aPath) {
			case "id":
				return this.getId();
			case "getField":
				return this.getField;
			case "getFieldValue":
				return this.getFieldValue;
		}
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		return Wprr.objectPath(this.getFieldValue(firstPart), restParts);
	}
	
	getSaveData() {
		let saveData = Wprr.wp.admin.SaveData.create(this.item.id);
		
		let currentArray = this.getFieldsToSave();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			currentField.addToSaveData(saveData);
		}
		
		return saveData;
	}
	
	getSaveDatas() {
		
		if(!this.hasUnsavedChanges()) {
			return [];
		}
		
		return [this.getSaveData()];
	}
	
	toJSON() {
		return "[InternalMessageGroup id=" + this._id + "]";
	}
}
import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class Form extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._isValidChangeCommand = Wprr.commands.callFunction(this, this._isValidChange);
	}
	
	setup() {
		
		this.item.getNamedLinks("fields");
		this.item.setValue("isValid", true);
		this.item.setValue("validationStatus", "not-validated");
		
		this.item.addType("controller", this);
		
		return this;
	}
	
	createField(aName, aValue) {
		//console.log("createField");
		
		let fields = this.item.getNamedLinks("fields");
		
		if(!fields.hasLinkByName(aName)) {
			let newItem = this.item.group.createInternalItem();
			
			newItem.addSingleLink("form", this.item.id);
			let controller = new Wprr.utils.data.multitypeitems.controllers.form.FormField();
			newItem.addType("controller", controller);
			controller.setup(aValue);
			
			newItem.getValueSource("isValid").addChangeCommand(this._isValidChangeCommand);
			
			fields.addItem(aName, newItem.id);
		}
		else {
			console.warn("Field " + aName + " already exist.", this);
		}
		
		return fields.getLinkByName(aName);
	}
	
	getField(aName) {
		let fields = this.item.getNamedLinks("fields");
		
		if(!fields.hasLinkByName(aName)) {
			console.warn("Field " + aName + " doesn't exist. Creating.", this);
			
			this.createField(aName, "");
		}
		
		return fields.getLinkByName(aName);
	}
	
	_isValidChange() {
		console.log("_isValidChange");
		
		let isValid = true;
		let currentArray = this.item.getNamedLinks("fields").items;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			let currentIsValid = currentField.getValue("isValid");
			if(!currentIsValid) {
				isValid = false;
				break;
			}
		}
		
		this.item.setValue("isValid", isValid);
	}
	
	validate() {
		let currentArray = this.item.getNamedLinks("fields").items;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			currentField.getType("controller").validate();
		}
		
		let isValid = this.item.getValue("isValid");
		
		if(isValid) {
			this.item.setValue("validationStatus", "valid");
		}
		else {
			this.item.setValue("validationStatus", "invalid");
		}
	}
	
	getValues() {
		let returnObject = new Object();
		
		let fields = this.item.getNamedLinks("fields");
		let currentArray = fields.names;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			
			returnObject[currentName] = fields.getLinkByName(currentName).getValue("value");
		}
		
		return returnObject;
	}
	
	toJSON() {
		return "[Form id=" + this._id + "]";
	}
}
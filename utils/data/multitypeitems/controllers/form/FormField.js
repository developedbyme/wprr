import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class FormField extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._valueChangeCommand = Wprr.commands.callFunction(this, this._valueChange);
		this._fieldEditingChangeCommand = Wprr.commands.callFunction(this, this._fieldEditingChange);
	}
	
	setup(aValue) {
		
		this.item.setValue("value", aValue);
		this.item.getValueSource("value").addChangeCommand(this._valueChangeCommand);
		
		this.item.setValue("isValid", true);
		this.item.setValue("validationFunctions", []);
		this.item.setValue("validationStatus", "not-validated");
		
		this.item.setValue("isEditing", false);
		this.item.getValueSource("isEditing").addChangeCommand(this._fieldEditingChangeCommand);
		
		this.item.setValue("validationMode", "blur");
		this.item.setValue("focusMode", "resetInvalid");
		
		return this;
	}
	
	addValidationFunction(aFunction) {
		let functions = [].concat(this.item.getValue("validationFunctions"));
		
		functions.push(aFunction);
		
		this.item.setValue("validationFunctions", functions);
		
		this.item.setValue("isValid", this._checkIfValid());
		
		return this;
	}
	
	removeValidations() {
		this.item.setValue("validationFunctions", []);
		
		this.item.setValue("isValid", this._checkIfValid());
		
		return this;
	}
	
	addPositiveValueValidation() {
		this.addValidationFunction(Wprr.utils.validations.positiveValue);
		
		return this;
	}
	
	addNotEmptyValidation() {
		this.addValidationFunction(Wprr.utils.validations.notEmpty);
		
		return this;
	}
	
	addEmailValidation() {
		this.addValidationFunction(Wprr.utils.validations.isEmail);
		
		return this;
	}
	
	addCheckedValidation() {
		this.addValidationFunction(Wprr.utils.validations.checkboxClicked);
		
		return this;
	}
	
	addPhoneNumberValidation() {
		this.addValidationFunction(Wprr.utils.validations.phoneNumber);
		
		return this;
	}
	
	_fieldEditingChange() {
		console.log("_fieldEditingChange");
		
		let isEditing = this.item.getValue("isEditing");
		let validationMode = this.item.getValue("validationMode");
		if(isEditing) {
			let focusMode = this.item.getValue("focusMode");
			if(focusMode === "resetInvalid") {
				let isValid = this.item.getValue("isValid");
				if(!isValid) {
					this.item.setValue("validationStatus", "not-validated");
				}
			}
			else if(focusMode === "reset") {
				this.item.setValue("validationStatus", "not-validated");
			}
		}
		else if(validationMode === "blur") {
			this.validate();
		}
	}
	
	_valueChange() {
		console.log("_valueChange");
		
		this.item.setValue("isValid", this._checkIfValid());
		
		let validationMode = this.item.getValue("validationMode");
		
		if(validationMode === "edit") {
			this.validate();
		}
		else if(validationMode === "validOnEdit") {
			let isValid = this.item.getValue("isValid");
		
			if(isValid) {
				this.validate();
			}
		}
	}
	
	_checkIfValid() {
		let isValid = true;
		let value = this.item.getValue("value");
		
		let currentArray = this.item.getValue("validationFunctions");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentFunction = currentArray[i];
			if(!currentFunction(value, this.item)) {
				return false;
			}
		}
		
		return isValid;
	}
	
	validate() {
		console.log("validate");
		
		let isValid = this.item.getValue("isValid");
		
		if(isValid) {
			this.item.setValue("validationStatus", "valid");
		}
		else {
			this.item.setValue("validationStatus", "invalid");
		}
	}
	
	toJSON() {
		return "[FormField id=" + this._id + "]";
	}
}
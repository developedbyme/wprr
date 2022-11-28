import React from "react";
import ReactDOM from 'react-dom';
import Wprr from "wprr/Wprr";
require('formdata-polyfill');

import WprrBaseObject from "wprr/WprrBaseObject";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import CommandPerformer from "wprr/commands/CommandPerformer";

// import ValidatingForm from "wprr/elements/form/ValidatingForm";
export default class ValidatingForm extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._elementsToValidate = new Array();
		this._mainElementType = "form";
		this._externalStorage = new Wprr.utils.DataStorage();
		this._externalStorage.updateValue("validationStatus", "notValidated");
		
		this._callback_submitBound = this._callback_submit.bind(this);
	}
	
	removeInvalidStateOnChange() {
		this._externalStorage.updateValue("validationStatus", "notValidated");
	}
	
	trigger(aName, aValue) {
		if(aName === "form/submit") {
			this._trigger_submit();
		}
	}
	
	_trigger_submit() {
		if(this.validate()) {
			
			//METODO: send out fake event?
			let handleResult = this._handleSubmit(null);
			
			if(!handleResult) {
				ReactDOM.findDOMNode(this).submit();
			}
		}
		else {
			//console.log("Form did not validate.", this);
		}
	}
	
	_handleSubmit(aEvent) {
		//console.log("wprr/elements/form/ValidatingForm::addValidation");
		
		let submitCommands = this.getSourcedProp("submitCommands");
		if(submitCommands) {
			CommandPerformer.perform(submitCommands, this.getFormData(), this);
			return true;
		}
		
		let submitFunction = this.getSourcedProp("onSubmit");
		if(submitFunction) {
			submitFunction(aEvent, this);
			return true;
		}
		
		return false;
	}
	
	addValidation(aObject) {
		//console.log("wprr/elements/form/ValidatingForm::addValidation");
		this._elementsToValidate.push(aObject);
	}
	
	removeValidation(aObject) {
		//console.log("wprr/elements/form/ValidatingForm::removeValidation");
		let isFound = false;
		
		let currentArray = this._elementsToValidate;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			if(currentArray[i] === aObject) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
				isFound = true;
			}
		}
		
		if(!isFound) {
			console.error("Validation object not added. Can't remove.", this);
		}
	}
	
	validate() {
		
		let invalidFields = new Array();
		
		let returnValue = true;
		let currentArray = this._elementsToValidate;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentField = currentArray[i];
			let currentFieldIsValid = currentField.validate("submit");
			
			if(!currentFieldIsValid) {
				invalidFields.push(currentField);
			}
			
			returnValue &= currentFieldIsValid;
		}
		
		if(returnValue) {
			let commands = this.getSourcedProp("validCommands");
			if(commands) {
				CommandPerformer.perform(commands, null, this);
			}
			this._externalStorage.updateValue("validationStatus", "valid");
		}
		else {
			let commands = this.getSourcedProp("invalidCommands");
			if(commands) {
				CommandPerformer.perform(commands, invalidFields, this);
			}
			
			this._externalStorage.updateValue("validationStatus", "invalid");
		}
		
		return returnValue;
	}
	
	_callback_submit(aEvent) {
		//console.log("wprr/elements/form/ValidatingForm::_callback_submit");
		//console.log(aEvent);
		
		if(!this.validate()) {
			aEvent.preventDefault();
		}
		else {
			let handleResult = this._handleSubmit(aEvent);
			if(handleResult) {
				aEvent.preventDefault();
			}
		}
	}
	
	submit() {
		//console.log("wprr/elements/form/ValidatingForm::submit");
		
		this._trigger_submit();
		
	}
	
	getFormData() {
		//console.log("wprr/elements/form/ValidatingForm::getFormData");
		
		return new FormData(this.getMainElement());
	}
	
	_copyPassthroughProps(aReturnObject) {
		
		super._copyPassthroughProps(aReturnObject);
		
		if(this.props["action"]) {
			aReturnObject["action"] = this.getSourcedProp("action");
		}
		if(this.props["method"]) {
			aReturnObject["method"] = this.getSourcedProp("method");
		}
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		returnObject["onSubmit"] = this._callback_submitBound;
		
		return returnObject;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/form/ValidatingForm::_renderMainElement");
		
		return React.createElement("wrapper", {}, 
			React.createElement(ReferenceInjection, {"injectData": {"validation/form": this, "validation/externalStorage": this._externalStorage, "trigger/form/submit": this}},
				React.createElement("div", {}, 
					this.props.children
				)
			)
		);
	}

}

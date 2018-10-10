import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import CommandPerformer from "wprr/commands/CommandPerformer";

// import ValidatingForm from "wprr/elements/form/ValidatingForm";
export default class ValidatingForm extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._elementsToValidate = new Array();
		this._mainElementType = "form";
		
		this._callback_submitBound = this._callback_submit.bind(this);
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
			console.log("Form did not validate.", this);
		}
	}
	
	_handleSubmit(aEvent) {
		
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
		var isFound = false;
		
		var currentArray = this._elementsToValidate;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
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
		var returnValue = true;
		var currentArray = this._elementsToValidate;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFieldIsValid = currentArray[i].validate("submit");
			
			returnValue &= currentFieldIsValid;
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
			this._handleSubmit(aEvent);
		}
	}
	
	submit() {
		//console.log("wprr/elements/form/ValidatingForm::submit");
		
		this._trigger_submit();
		
	}
	
	getFormData() {
		return new FormData(ReactDOM.findDOMNode(this));
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
		var returnObject = super._getMainElementProps();
		
		returnObject["onSubmit"] = this._callback_submitBound;
		
		return returnObject;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/form/ValidatingForm::_renderMainElement");
		
		return <wrapper>
			<ReferenceInjection injectData={{"validation/form": this, "trigger/form/submit": this}}>
				<div>
					{this.props.children}
				</div>
			</ReferenceInjection>
		</wrapper>;
	}

}

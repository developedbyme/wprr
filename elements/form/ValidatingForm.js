import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

// import ValidatingForm from "wprr/elements/form/ValidatingForm";
export default class ValidatingForm extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._elementsToValidate = new Array();
		this._mainElementType = "form";
		
		this._callback_submitBound = this._callback_submit.bind(this);
	}
	
	addValidation(aObject) {
		console.log("wprr/elements/form/ValidatingForm::addValidation");
		this._elementsToValidate.push(aObject);
	}
	
	removeValidation(aObject) {
		console.log("wprr/elements/form/ValidatingForm::removeValidation");
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
		console.log("wprr/elements/form/ValidatingForm::_callback_submit");
		console.log(aEvent);
		
		if(!this.validate()) {
			aEvent.preventDefault();
		}
		else {
			if(this.props.onSubmit) {
				this.props.onSubmit(aEvent);
			}
		}
	}
	
	submit() {
		console.log("wprr/elements/form/ValidatingForm::submit");
		
		if(this.validate()) {
			ReactDOM.findDOMNode(this).submit();
		}
	}
	
	_copyPassthroughProps(aReturnObject) {
		
		if(this.props["action"]) {
			aReturnObject["action"] = this.props["action"];
		}
		if(this.props["method"]) {
			aReturnObject["method"] = this.props["method"];
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
			<ReferenceInjection injectData={{"validation/form": this}}>
				<div>
					{this.props.children}
				</div>
			</ReferenceInjection>
		</wrapper>;
	}

}

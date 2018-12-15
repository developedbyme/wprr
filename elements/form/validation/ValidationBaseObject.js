import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

// import ValidationBaseObject from "wprr/elements/form/validation/ValidationBaseObject";
export default class ValidationBaseObject extends ManipulationBaseObject {

	constructor(props) {
		super(props);
		
		this.state["valid"] = ValidationBaseObject.NOT_VALIDATED;
		
	}
	
	componentWillMount() {
		let validationController = this.getReference("validation/form");
		if(validationController) {
			validationController.addValidation(this);
		}
	}
	
	componentWillUnmount() {
		let validationController = this.getReference("validation/form");
		if(validationController) {
			validationController.removeValidation(this);
		}
	}
	
	componentWillReceiveProps(aNextProps) {
		//console.log("wprr/elements/form/validation/ValidationBaseObject::componentWillReceiveProps");
		this._validateWithProps("change", aNextProps);
	}
	
	validate(aType) {
		return this._validateWithProps(aType, this.props);
	}
	
	_validateWithProps(aType, aProps) {
		//console.log("wprr/elements/form/validation/ValidationBaseObject::_validateWithProps");
		
		let statePropsObject = {"state": this.state, "props": aProps};
		
		let valueName = this.getSourcedPropInStateChange("valueName", statePropsObject);
		
		let checkValue = null;
		if(aProps.check) {
			checkValue = this.getSourcedPropInStateChange("check", statePropsObject);
		}
		else {
			checkValue = this.getSourcedPropInStateChange(valueName, statePropsObject);
		}
		let validationFunction = this.getSourcedPropInStateChange("validateFunction", statePropsObject);
		
		let additionalData = this.getSourcedPropInStateChange("additionalData", statePropsObject);
		let alsoValidate = this.getSourcedPropInStateChange("alsoValidate", statePropsObject);
		
		let additionalDataAndElement = {
			"element": this,
			"data": additionalData
		}
		//console.log(checkValue);
		
		let newValid = this.state["valid"];
		if(aType === "focus") {
			if(this.state["valid"] === -1) {
				newValid = 0;
			}
		}
		else if(aType === "blur") {
			let validateOnBlur = this.getSourcedPropInStateChange("validateOnBlur", statePropsObject);
			if(validateOnBlur) {
				newValid = validationFunction(checkValue, additionalDataAndElement) ? 1 : -1;
			}
			
			if(validateOnBlur === ValidationBaseObject.VALIDATE_ONLY_TRUE && newValid === -1) {
				newValid = 0;
			}
			
			if(alsoValidate) {
				//METODO: support arrays
				alsoValidate.validate(aType);
			}
		}
		else if(aType === "change") {
			let validateOnChange = this.getSourcedPropInStateChange("validateOnChange", statePropsObject);
			if(validateOnChange) {
				newValid = validationFunction(checkValue, additionalDataAndElement) ? 1 : -1;
			}
			
			if(validateOnChange === ValidationBaseObject.VALIDATE_ONLY_TRUE && newValid === -1) {
				newValid = 0;
			}
			
			if(alsoValidate) {
				//METODO: support arrays
				alsoValidate.validate(aType);
			}
		}
		else if(aType === "submit") {
			newValid = validationFunction(checkValue, additionalDataAndElement) ? 1 : -1;
			if(newValid === -1) {
				console.log(checkValue + " is not valid for field " + valueName + ".", this);
			}
		}
		
		if(newValid !== this.state["valid"]) {
			this.setState({"valid": newValid});
		}
		
		return (newValid >= 0);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/elements/form/validation/ValidationBaseObject::_manipulateProps");
		
		aReturnObject["valid"] = this.state["valid"];
		
		delete aReturnObject["validateFunction"];
		delete aReturnObject["validateOnChange"];
		delete aReturnObject["validateOnBlur"];
		delete aReturnObject["alsoValidate"];
		
		return aReturnObject;
	}
	
	_createClonedElement() {
		
		this._clonedElement = React.createElement(ReferenceInjection, {"injectData": {"validation/validate": this}}, this._renderClonedElement());
	}
}

ValidationBaseObject.VALID = 1;
ValidationBaseObject.NOT_VALIDATED = 0;
ValidationBaseObject.INVALID = -1;

ValidationBaseObject.VALIDATE_ONLY_TRUE = 2;

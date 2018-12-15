import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ValidationBaseObject from "wprr/elements/form/validation/ValidationBaseObject";

import ClassFromProp from "wprr/manipulation/adjustfunctions/ClassFromProp";
import RemoveProps from "wprr/manipulation/adjustfunctions/RemoveProps";
import Adjust from "wprr/manipulation/Adjust";

// import ClassNameValidation from "wprr/elements/form/validation/ClassNameValidation";
export default class ClassNameValidation extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/elements/form/validation/ClassNameValidation::_manipulateProps");
		
		delete aReturnObject["validClass"];
		delete aReturnObject["invalidClass"];
		delete aReturnObject["notValidatedClass"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let validClass = this.getSourcedPropWithDefault("validClass", "valid");
		let invalidClass = this.getSourcedPropWithDefault("invalidClass", "invalid");
		let notValidatedClass = this.getSourcedPropWithDefault("notValidatedClass", "notValidated");
		
		return [React.createElement(ValidationBaseObject, {}, 
			React.createElement(Adjust, {"adjust": [
				ClassFromProp.create("valid", [
					{"key": ValidationBaseObject.VALID, "value": validClass},
					{"key": ValidationBaseObject.INVALID, "value": invalidClass},
					{"key": ValidationBaseObject.NOT_VALIDATED, "value": notValidatedClass}
				]),
				RemoveProps.create("valid")
			]},
				super._getChildrenToClone()
			)
		)];
	}
}

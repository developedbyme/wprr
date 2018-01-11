import React from "react";

import StepButton from "wprr/elements/interaction/StepButton";

import SelectSection from "wprr/elements/area/SelectSection";
import SourceData from "wprr/reference/SourceData";

//import StepButtonWithLimit from "wprr/elements/interaction/StepButtonWithLimit";
export default class StepButtonWithLimit extends StepButton {

	constructor(props) {
		//console.log("wprr/elements/interaction/StepButtonWithLimit::constructor");
		super(props);
	}
	
	_shouldTriggerValueChange(aNewValue) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_shouldTriggerValueChange");
		//MENOTE: always return true, intented to be overriden.
		
		let minValue = this.getSourcedProp("minValue");
		let maxValue = this.getSourcedProp("maxValue");
		
		//console.log(aNewValue, minValue, maxValue);
		if(minValue != null && aNewValue < minValue) {
			return  false;
		}
		if(maxValue != null && aNewValue > maxValue) {
			return  false;
		}
		
		return true;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		let returnObject = super._removeUsedProps(aReturnObject);
		
		delete returnObject["minValue"];
		delete returnObject["maxValue"];
		
		return returnObject;
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_manipulateProps");
		let returnObject = super._manipulateProps(aReturnObject);
		
		returnObject["active"] = this._shouldTriggerValueChange(this.getNextValue());
		
		return returnObject;
	}
}

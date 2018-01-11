import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SelectSection from "wprr/elements/area/SelectSection";
import SourceData from "wprr/reference/SourceData";

//import StepButton from "wprr/elements/interaction/StepButton";
export default class StepButton extends ManipulationBaseObject {

	constructor(props) {
		//console.log("wprr/elements/interaction/StepButton::constructor");
		super(props);
		
		this._mainElementType = "div";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/interaction/StepButton::_callback_change");
		
		var valueName = this.getSourcedPropWithDefault("valueName", "value");
		var stepValue = this.getSourcedPropWithDefault("stepValue", 1);
		
		var currentValue = this.getSourcedPropWithDefault("value", SourceData.create("prop", valueName));
		var newValue = currentValue+stepValue;
		
		this.getReferences().getObject("value/" + valueName).updateValue(valueName, newValue, this.props.additionalData);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		let returnArray = super._removeUsedProps(aReturnObject);
		
		delete returnArray["valueName"];
		delete returnArray["stepValue"];
		delete returnArray["value"];
		
		return returnArray;
	}
	
	_manipulateProps(aReturnObject) {
		aReturnObject["onClick"] = this._callback_changeBound;
		
		return aReturnObject;
	}
}

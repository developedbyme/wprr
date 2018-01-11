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
	
	_shouldTriggerValueChange(aNewValue) {
		//MENOTE: always return true, intented to be overriden.
		
		return true;
	}
	
	_triggerValueChange(aNewValue, aAdditionalData) {
		
		let valueName = this.getSourcedPropWithDefault("valueName", "value");
		let fullValuePath = "value/" + valueName;
		
		const updateObject = this.getReferences().getObject(fullValuePath);
		if(updateObject) {
			updateObject.updateValue(valueName, aNewValue, aAdditionalData);
		}
		else {
			console.warn("No controller listens to " + fullValuePath + ". Can't trigger update.", this);
		}
	}
	
	getNextValue() {
		let valueName = this.getSourcedPropWithDefault("valueName", "value");
		let stepValue = this.getSourcedPropWithDefault("stepValue", 1);
		
		let currentValue = this.getSourcedPropWithDefault("value", SourceData.create("prop", valueName));
		let newValue = currentValue+stepValue;
		
		return newValue;
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/interaction/StepButton::_callback_change");
		
		let newValue = this.getNextValue();
		
		if(this._shouldTriggerValueChange(newValue)) {
			this._triggerValueChange(newValue, this.props.additionalData); //METODO: source additional data
		}
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		let returnObject = super._removeUsedProps(aReturnObject);
		
		delete returnObject["valueName"];
		delete returnObject["stepValue"];
		delete returnObject["value"];
		
		return returnObject;
	}
	
	_manipulateProps(aReturnObject) {
		let returnObject = super._manipulateProps(aReturnObject);
		
		returnObject["onClick"] = this._callback_changeBound;
		
		return returnObject;
	}
}

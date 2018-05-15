import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

//import ToggleButton from "wprr/elements/interaction/ToggleButton";
export default class ToggleButton extends ManipulationBaseObject {

	constructor(props) {
		//console.log("wprr/elements/interaction/ToggleButton::constructor");
		super(props);
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/elements/interaction/ToggleButton::_removeUsedProps");
		let returnObject = super._removeUsedProps(aReturnObject);
		
		delete returnObject["valueName"];
		delete returnObject["trueValue"];
		delete returnObject["falseValue"];
		delete returnObject["value"];
		
		return returnObject;
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/interaction/ToggleButton::_callback_change");
		
		var valueName = this.getSourcedPropWithDefault("valueName", "value");
		var trueValue = this.getSourcedPropWithDefault("trueValue", true);
		var falseValue = this.getSourcedPropWithDefault("falseValue", false);
		
		var currentValue = this.getSourcedPropWithDefault("value", SourceData.create("prop", valueName));
		var newValue = (currentValue === trueValue) ? falseValue : trueValue;
		
		this.getReferences().getObject("value/" + valueName).updateValue(valueName, newValue, this.props.additionalData);
	}
	
	_manipulateProps(aReturnObject) {
		aReturnObject["onClick"] = this._callback_changeBound;
		
		var valueName = this.getSourcedPropWithDefault("valueName", "value");
		var trueValue = this.getSourcedPropWithDefault("trueValue", true);
		
		var currentValue = this.getSourcedPropWithDefault("value", SourceData.create("prop", valueName));
		
		aReturnObject["value"] = (currentValue === trueValue);
		
		return aReturnObject;
	}
}

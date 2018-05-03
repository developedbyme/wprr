import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

//import SetValueButton from "wprr/elements/interaction/SetValueButton";
export default class SetValueButton extends ManipulationBaseObject {

	constructor(props) {
		//console.log("wprr/elements/interaction/SetValueButton::constructor");
		super(props);
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/interaction/SetValueButton::_callback_change");
		
		let valueName = this.getSourcedPropWithDefault("valueName", "value");
		
		let value = this.getSourcedPropWithDefault("value", SourceData.create("prop", valueName));
		
		let updateController = this.getReferences().getObject("value/" + valueName);
		
		if(updateController) {
			updateController.updateValue(valueName, value, this.props.additionalData);
		}
		else {
			console.warn("Controller for " + valueName + " doesn't exist. Can't trigger update.", this);
		}
	}
	
	_manipulateProps(aReturnObject) {
		aReturnObject["onClick"] = this._callback_changeBound;
		
		delete aReturnObject["valueName"];
		delete aReturnObject["value"];
		
		return aReturnObject;
	}
}

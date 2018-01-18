import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import TriggerButton from "wprr/elements/interaction/TriggerButton";
export default class TriggerButton extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		console.log("wprr/elements/interaction/TriggerButton::_callback_change");
		
		var triggerName = this.getSourcedPropWithDefault("triggerName", "button");
		var triggerData = this.getSourcedPropWithDefault("triggerData", null);
		
		this.getReferences().getObject("trigger/" + triggerName).trigger(triggerName, triggerData);
	}
	
	_manipulateProps(aReturnObject) {
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		returnObject["onClick"] = this._callback_changeBound;
		
		delete returnObject["triggerName"];
		delete returnObject["triggerData"];
		
		return returnObject;
	}
}
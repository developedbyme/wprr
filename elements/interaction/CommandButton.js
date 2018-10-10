import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import CommandButton from "wprr/elements/interaction/CommandButton";
export default class CommandButton extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		console.log("wprr/elements/interaction/CommandButton::_callback_change");
		
		let commands = this.getSourcedProp("commands");
		
		
		if(commands) {
			let commandData = this.getSourcedProp("commandData");
			
			CommandPerformer.perform(commands, commandData, this);
		}
		else {
			console.error("Button doesn't have any commands", this);
		}
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		returnObject["onClick"] = this._callback_changeBound;
		
		delete returnObject["commands"];
		delete returnObject["commandData"];
		
		return returnObject;
	}
}
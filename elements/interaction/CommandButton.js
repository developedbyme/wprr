import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import CommandButton from "wprr/elements/interaction/CommandButton";
export default class CommandButton extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._callback_clickBound = this._callback_click.bind(this);
	}
	
	_callback_click(aEvent) {
		//console.log("wprr/elements/interaction/CommandButton::_callback_click");
		
		let commands = this.getSourcedProp("commands");
		
		if(commands) {
			let commandData = this.getSourcedProp("commandData");
			if(!commandData) {
				commandData = aEvent;
			}
			else {
				console.warn("commandData is depreciated.", this);
			}
			
			CommandPerformer.perform(commands, commandData, this);
		}
		else {
			console.error("Button doesn't have any commands", this);
		}
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		returnObject["onClick"] = this._callback_clickBound;
		
		delete returnObject["commands"];
		delete returnObject["commandData"];
		
		return returnObject;
	}
}
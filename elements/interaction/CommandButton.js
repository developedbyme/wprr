import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import CommandButton from "wprr/elements/interaction/CommandButton";
export default class CommandButton extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		console.log("wprr/elements/interaction/CommandButton::_callback_change");
		
		let commands = this.getSourcedProp("commands");
		let commandData = this.getSourcedProp("commandData");
		
		if(commands) {
			let currentArray;
			if(Array.isArray(commands)) {
				currentArray = commands;
			}
			else {
				currentArray = [commands];
			}
			
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				//METODO: resolve command
				let currentCommand = currentArray[i];
				
				currentCommand.setTriggerElement(this);
				currentCommand.setEventData(commandData);
				
				currentCommand.perform();
			}
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
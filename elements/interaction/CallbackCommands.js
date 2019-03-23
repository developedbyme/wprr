import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import CallbackCommands from "wprr/elements/interaction/CallbackCommands";
export default class CallbackCommands extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._callbackFunctions = new Object();
		
	}
	
	_callback_event(aType, ...aParameters) {
		//console.log("wprr/elements/interaction/CallbackCommands::_callback_event");
		
		let callbacks = this.getSourcedProp("callbacks");
		let commands = callbacks[aType];
		
		if(commands) {
			CommandPerformer.perform(commands, aParameters, this);
		}
		else {
			console.error("No commands for " + aType, this);
		}
	}
	
	_getCallbackFucntion(aName) {
		if(!this._callbackFunctions[aName]) {
			this._callbackFunctions[aName] = this._callback_event.bind(this, aName);
		}
		
		return this._callbackFunctions[aName];
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		let callbacks = this.getSourcedProp("callbacks");
		
		for(let objectName in callbacks) {
			returnObject[objectName] = this._getCallbackFucntion(objectName);
		}
		
		delete returnObject["callbacks"];
		
		return returnObject;
	}
}

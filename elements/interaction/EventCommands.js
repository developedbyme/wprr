import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import EventCommands from "wprr/elements/interaction/EventCommands";
export default class EventCommands extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._callback_eventBound = this._callback_event.bind(this);
	}
	
	_callback_event(aEvent) {
		//console.log("wprr/elements/interaction/EventCommands::_callback_event");
		
		let type = aEvent.type.toLowerCase();
		
		let onName = EventCommands.nameToOnMap[type];
		
		let events = this.getSourcedProp("events");
		let commands = events[onName];
		
		if(commands) {
			let commandData = this.getSourcedProp("commandData");
			
			let currentCommandData = null;
			if(commandData && commandData[onName]) {
				currentCommandData = commandData[onName];
			}
			
			CommandPerformer.perform(commands, commandData, this);
		}
		else {
			console.error("No commands for " + type + "/" + onName, EventCommands, this);
		}
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		let events = this.getSourcedProp("events");
		
		for(let objectName in events) {
			EventCommands.addEventMap(objectName, objectName.substring(2, objectName.length).toLowerCase());
			returnObject[objectName] = this._callback_eventBound;
		}
		
		delete returnObject["events"];
		
		return returnObject;
	}
	
	static addEventMap(aOnName, aName) {
		if(!EventCommands.nameToOnMap[aName]) {
			EventCommands.nameToOnMap[aName] = aOnName;
			EventCommands.onToNameMap[aOnName] = aName;
		}
		
	}
}

EventCommands.nameToOnMap = new Object();
EventCommands.onToNameMap = new Object();

import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import StateCommands from "wprr/manipulation/StateCommands";
export default class StateCommands extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._lastState = null;
	}
	
	/**
	 * Removes the used props for this component.
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	_removeUsedProps(aProps) {
		//console.log("wprr/manipulation/StateCommands::removeUsedProps");
		
		super._removeUsedProps(aProps);
		
		this._cleanupProp("state", aProps);
		this._cleanupProp("commands", aProps);
		
		return aProps;
	}
	
	_updateState() {
		let newState = this.getSourcedProp("state");
		
		if(newState !== this._lastState) {
			this._lastState = newState;
			
			let commands = this.getSourcedProp("commands");
			if(commands && commands[newState]) {
				CommandPerformer.perform(commands[newState], newState, this);
			}
			else {
				console.warn("No commands for state " + newState, this);
			}
		}
	}
	
	componentDidMount() {
		super.componentDidMount();
		
		this._updateState();
	}
	
	componentDidUpdate() {
		super.componentDidUpdate();
		
		this._updateState();
	}
}

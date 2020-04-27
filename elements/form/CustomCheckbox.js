import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

// import CustomCheckbox from "wprr/elements/form/CustomCheckbox";
export default class CustomCheckbox extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._changeCallbackCommand = Wprr.commands.callFunction(this, this.change);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("CustomCheckbox::_removeUsedProps");
		
		delete aReturnObject["valueName"];
		delete aReturnObject["checked"];
		
		return aReturnObject;
	}
	
	change() {
		//console.log("CustomCheckbox::change");
		
		let valueName = this.getSourcedProp("valueName");
		let checked = !this.getSourcedPropWithDefault("checked", Wprr.source("propWithDots", Wprr.sourceProp("valueName")));
		
		let valueUpdater = this.getReference("value/" + valueName);
		if(valueUpdater) {
			valueUpdater.updateValue(valueName, checked);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, checked, this);
		}
		
		this._validate("focus");
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		let checked = this.getSourcedPropWithDefault("checked", Wprr.source("propWithDots", Wprr.sourceProp("valueName")));
		
		return [React.createElement(Wprr.CommandButton, {"commands": this._changeCallbackCommand},
			React.createElement(Wprr.OnOffArea, {"value": checked}, children)
		)];
	}
}

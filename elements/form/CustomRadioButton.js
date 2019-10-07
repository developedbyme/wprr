import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

// import CustomRadioButton from "wprr/elements/form/CustomRadioButton";
export default class CustomRadioButton extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("CustomSelection::_removeUsedProps");
		
		delete aReturnObject["valueName"];
		delete aReturnObject["selectedValue"];
		delete aReturnObject["value"];
		delete aReturnObject["checked"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		let valueName = this.getSourcedProp("valueName");
		let selectedValue = this.getSourcedPropWithDefault("selectedValue", Wprr.sourceProp(this.getSourcedProp("valueName")));
		let value = this.getSourcedProp("value");
		let checked = this.getSourcedPropWithDefault("checked", selectedValue === value);
		
		return [React.createElement(Wprr.CommandButton, {"commands": [Wprr.commands.setValue(Wprr.sourceReference("value/" + valueName), valueName, value)]},
			React.createElement(Wprr.OnOffArea, {"value": checked}, children)
		)];
	}
}

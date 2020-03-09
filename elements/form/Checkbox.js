import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import Checkbox from "wprr/elements/form/Checkbox";
export default class Checkbox extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "input";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/form/Checkbox::_callback_change");
		
		let valueName = this.getSourcedProp("valueName");
		let newValue = this.getSourcedProp("value");
		let checked = aEvent.target.checked;
		
		this.getReference("value/" + valueName).updateValue(valueName, aEvent.target.checked, {"value": newValue});
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, checked, this);
		}
		
		this._validate("focus");
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", true);
		let checked = this.getSourcedPropWithDefault("checked", SourceData.create("propWithDots", valueName));
		
		return checked ? value : !value;
	}
	
	validate(aType) {
		return this._validate(aType);
	}
	
	_validate(aType) {
		var validation = this.getReference("validation/validate");
		if(validation) {
			return validation.validate(aType);
		}
		
		return 1;
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		let valueName = this.getSourcedProp("valueName");
		
		returnObject["id"] = this.getSourcedProp("id");
		returnObject["name"] = this.getSourcedProp("name");
		returnObject["type"] = "checkbox";
		
		returnObject["value"] = this.getSourcedPropWithDefault("value", true);
		returnObject["checked"] = this.getSourcedPropWithDefault("checked", SourceData.create("propWithDots", valueName));
		returnObject["onChange"] = this._callback_changeBound;
		
		returnObject["disabled"] = this.getSourcedProp("disabled");
		
		return returnObject;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/Checkbox::_renderMainElement");
		
		return React.createElement("wrapper");
	}

}

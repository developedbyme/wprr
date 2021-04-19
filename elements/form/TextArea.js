import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import TextArea from "wprr/elements/form/TextArea";
export default class TextArea extends WprrBaseObject {

	constructor( aProps ) {
		super( aProps );
		
		this._mainElementType = "textarea";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/form/TextArea::_callback_change");
		//console.log(aEvent);
		//console.log(aEvent.target.value);
		
		let newValue = aEvent.target.value;
		
		this.updateProp("value", newValue);
		
		let updater = this.getReferences().getObject("value/" + this.props.valueName);
		if(updater) {
			let valueName = this.getFirstInput("valueName");
			updater.updateValue(valueName, newValue);
		}
		
		
		let commands = this.getFirstInput("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		returnObject["id"] = this.getFirstInput("id");
		returnObject["name"] = this.getFirstInput("name");
		returnObject["placeholder"] = this.getFirstInput("placeholder");
		
		let valueName = this.getFirstInput("valueName");
		
		let value = this.getFirstInput("value", Wprr.source("propWithDots", valueName));
		returnObject["value"] = value;
		
		returnObject["rows"] = this.getFirstInput("rows");
		
		returnObject["onChange"] = this._callback_changeBound;
		
		return returnObject;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/TextArea::_renderMainElement");
		
		return React.createElement("wrapper");
	}

}

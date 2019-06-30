import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import TextArea from "wprr/elements/form/TextArea";
export default class TextArea extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "textarea";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/form/TextArea::_callback_change");
		//console.log(aEvent);
		//console.log(aEvent.target.value);
		
		let newValue = aEvent.target.value;
		
		this.getReferences().getObject("value/" + this.props.valueName).updateValue(this.props.valueName, newValue);
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		returnObject["id"] = this.getSourcedProp("id");
		returnObject["name"] = this.getSourcedProp("name");
		returnObject["placeholder"] = this.getSourcedProp("placeholder");
		
		let valueName = this.getSourcedProp("valueName");
		
		let value = this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", valueName));
		returnObject["value"] = value;
		
		returnObject["rows"] = this.getSourcedProp("rows");
		
		returnObject["onChange"] = this._callback_changeBound;
		
		return returnObject;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/TextArea::_renderMainElement");
		
		return React.createElement("wrapper");
	}

}

import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import EditableProps from "wprr/manipulation/EditableProps";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import FormField from "wprr/elements/form/FormField";
export default class FormField extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "input";
		
		this._callback_changeBound = this._callback_change.bind(this);
		this._callback_blurBound = this._callback_blur.bind(this);
		this._callback_focusBound = this._callback_focus.bind(this);
	}
	
	getValue() {
		if(this.getSourcedProp("type") === "file") {
			let mainElement = this.getMainElement();
			if(mainElement !== null) {
				return mainElement.files;
			}
			return null;
		}
		
		let valueName = this.getSourcedProp("valueName");
		return this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", valueName));
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/form/FormField::_callback_change");
		//console.log(aEvent);
		//console.log(aEvent.target.value);
		
		let additionalData = this.getSourcedProp("additionalData");
		let valueName = this.getSourcedProp("valueName");
		
		let newValue = aEvent.target.value;
		if(this.getSourcedProp("type") === "file") {
			newValue = aEvent.target.files;
		}
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, newValue, additionalData);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	_validate(aType) {
		let validation = this.getReference("validation/validate");
		if(validation) {
			validation.validate(aType);
		}
	}
	
	_callback_blur(aEvent) {
		//console.log("wprr/elements/form/FormField::_callback_blur");
		
		this._validate("blur");
		
		let commands = this.getSourcedProp("blurCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, this, this);
		}
	}
	
	_callback_focus(aEvent) {
		//console.log("wprr/elements/form/FormField::_callback_focus");
		
		this._validate("focus");
		
		let commands = this.getSourcedProp("focusCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, this, this);
		}
	}
	
	_getMainElementProps() {
		var returnObject = super._getMainElementProps();
		
		returnObject["id"] = this.getSourcedProp("id");
		returnObject["name"] = this.getSourcedProp("name");
		returnObject["type"] = this.getSourcedProp("type");
		returnObject["placeholder"] = this.getSourcedProp("placeholder");
		
		let valueName = this.getSourcedProp("valueName");
		
		returnObject["value"] = this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", valueName));
		
		returnObject["onChange"] = this._callback_changeBound;
		returnObject["onBlur"] = this._callback_blurBound;
		returnObject["onFocus"] = this._callback_focusBound;
		
		returnObject["autoFocus"] = this.getSourcedProp("autoFocus");
		
		return returnObject;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/FormField::_renderMainElement");
		
		return React.createElement("wrapper");
	}
	
	static makeSelfContained(aElement, aValue = "") {
		
		return React.createElement(EditableProps, {"editableProps": "value", "value": aValue, "valueName": "value"}, aElement);
	}
}

import React from "react";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import EditableProps from "wprr/manipulation/EditableProps";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import FormField from "wprr/elements/form/FormField";
export default class FormField extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._mainElementType = "input";
		
		this._callback_changeBound = this._callback_change.bind(this);
		this._callback_blurBound = this._callback_blur.bind(this);
		this._callback_focusBound = this._callback_focus.bind(this);
	}
	
	getValue() {
		//console.log("wprr/elements/form/FormField::getValue");
		
		if(this.getSourcedProp("type") === "file") {
			let mainElement = this.getMainElement();
			if(mainElement !== null) {
				return mainElement.files;
			}
			console.error("Field doesn't have an element. Can't get value.", this);
			return null;
		}
		
		let valueName = this.getSourcedProp("valueName");
		if(!valueName) {
			console.warn("Field doesn't have a value name. Getting value from element instead.", this);
			let mainElement = this.getMainElement();
			if(mainElement !== null) {
				return mainElement.value;
			}
			console.error("Field doesn't have an element. Can't get value.", this);
			return null;
		}
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
		
		this.updateProp("value", newValue);
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, newValue, additionalData);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	validate(aType) {
		return this._validate(aType);
	}
	
	_validate(aType) {
		let validation = this.getReferenceIfExists("validation/validate");
		if(validation) {
			return validation.validate(aType);
		}
		
		return 1;
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
		
		let type = this.getSourcedProp("type");
		
		returnObject["type"] = type;
		returnObject["placeholder"] = this.getSourcedProp("placeholder");
		
		let valueName = this.getSourcedProp("valueName");
		
		let value = this.getSourcedPropWithDefault("value", SourceData.create("propWithDots", valueName));
		
		if(value && type === "datetime-local") {
			let valueMoment = moment(value);
			if(valueMoment.isValid()) {
				value = valueMoment.format("Y-MM-DDTHH:mm:ss");
			}
		}
		
		if(type !== "file") {
			returnObject["value"] = value;
		}
		
		returnObject["onChange"] = this._callback_changeBound;
		returnObject["onBlur"] = this._callback_blurBound;
		returnObject["onFocus"] = this._callback_focusBound;
		
		returnObject["autoFocus"] = this.getSourcedProp("autoFocus");
		returnObject["maxLength"] = this.getSourcedProp("maxLength");
		returnObject["autoComplete"] = this.getSourcedProp("autoComplete");
		
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

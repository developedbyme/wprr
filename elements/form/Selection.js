import Wprr from "wprr/Wprr";
import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import SourcedText from "wprr/elements/text/SourcedText";

// import Selection from "wprr/elements/form/Selection";
export default class Selection extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "select";
		
		this._callback_changeBound = this._callback_change.bind(this);
		this._callback_blurBound = this._callback_blur.bind(this);
		this._callback_focusBound = this._callback_focus.bind(this);
	}
	
	getValue() {
		let currentNode = ReactDOM.findDOMNode(this);
		
		return currentNode.options[currentNode.selectedIndex].value;
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		returnObject["onChange"] = this._callback_changeBound;
		returnObject["onBlur"] = this._callback_blurBound;
		returnObject["onFocus"] = this._callback_focusBound;
		
		let valueName = this.getSourcedProp("valueName");
		returnObject["value"] = this.getFirstInput("value", "selection", SourceData.create("propWithDots", valueName));
		
		return returnObject;
	}
	
	validate(aType) {
		//console.log("wprr/elements/form/Selection::validate");
		
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
		//console.log("wprr/elements/form/Selection::_callback_blur");
		
		this._validate("blur");
		
		let commands = this.getSourcedProp("blurCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, this, this);
		}
	}
	
	_callback_focus(aEvent) {
		//console.log("wprr/elements/form/Selection::_callback_focus");
		
		this._validate("focus");
		
		let commands = this.getSourcedProp("focusCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, this, this);
		}
	}
	
	_callback_change(aEvent) {
		//console.log("Selection::_callback_change");
		//console.log(aEvent);
		//console.log(aEvent.target.value);
		
		let value = aEvent.target.value;
		let additionalData = this.getSourcedProp("additionalData");
		
		let options = this.getSourcedProp("options");
		
		if(Array.isArray(options)) {
			let currentArray = options;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentData = currentArray[i];
				if(currentData.value == value) {
					if(currentData.additionalData !== undefined) {
						additionalData = currentData.additionalData;
					}
					break;
				}
			}
		}
		
		let valueName = this.getSourcedProp("valueName");
		
		this.updateProp("value", aEvent.target.value);
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, aEvent.target.value, additionalData);
		}
		
		let triggerName = this.getSourcedProp("triggerName");
		
		if(triggerName) {
			this.getReference("trigger/" + triggerName).trigger(triggerName, {"value": aEvent.target.value, "additionalData": additionalData});
		}
		
		let commandData = aEvent.target.value;
		let commands = this.getSourcedProp("changeCommands");
		if(commands) {
			let currentArray;
			if(Array.isArray(commands)) {
				currentArray = commands;
			}
			else {
				currentArray = [commands];
			}
			
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				//METODO: resolve command
				let currentCommand = currentArray[i];
				
				currentCommand.setTriggerElement(this);
				currentCommand.setEventData(commandData);
				
				currentCommand.perform();
			}
		}
	}

	_renderMainElement() {
		//console.log("Selection::_renderMainElement");
		
		let optionElements = new Array();
		
		let options = this.getFirstInput("options");
		
		if(Array.isArray(options)) {
			let currentArray = options;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentObject = currentArray[i];
				
				if(typeof(currentObject) === "object") {
					optionElements.push(React.createElement("option", {"key": currentObject["value"], "value": currentObject["value"]},
						SourcedText.escapeString(currentObject["label"])
					));
				}
				else {
					optionElements.push(React.createElement("option", {"key": currentObject, "value": currentObject},
						SourcedText.escapeString(currentObject)
					));
				}
			}
		}
		else {
			for(let objectName in options) {
				optionElements.push(React.createElement("option", {"key": objectName, "value": objectName},
					SourcedText.escapeString(options[objectName])
				));
			}
		}
		
		let checksum = Wprr.utils.array.mapField(options, "value");
		
		return React.createElement("wrapper", {}, 
			React.createElement(Wprr.UpdateCheck, {"checksum": checksum},
				optionElements
			)
		);
	}
}

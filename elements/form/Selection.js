import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";

// import Selection from "wprr/elements/form/Selection";
export default class Selection extends WprrBaseObject {

	constructor( props ) {
		super( props );
		
		this._mainElementType = "select";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	getValue() {
		let currentNode = ReactDOM.findDOMNode(this);
		
		return currentNode.options[currentNode.selectedIndex].value;
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		returnObject["onChange"] = this._callback_changeBound;
		
		let valueName = this.getSourcedProp("valueName");
		returnObject["value"] = this.getSourcedPropWithDefault("selection", SourceData.create("prop", valueName));
		
		return returnObject;
	}
		
	componentWillMount() {
		
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
		
		if(valueName) {
			this.getReference("value/" + valueName).updateValue(valueName, aEvent.target.value, additionalData);
		}
		
		let triggerName = this.getSourcedProp("triggerName");
		
		if(triggerName) {
			this.getReference("trigger/" + triggerName).trigger(triggerName, {"value": aEvent.target.value, "additionalData": additionalData});
		}
	}

	_renderMainElement() {
		//console.log("Selection::_renderMainElement");
		
		let optionElements = new Array();
		
		let options = this.getSourcedProp("options");
		
		if(Array.isArray(options)) {
			let currentArray = options;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentObject = currentArray[i];
				
				if(typeof(currentObject) === "object") {
					optionElements.push(<option key={currentObject["value"]} ref={"option-" + currentObject["value"]} value={currentObject["value"]}>{Selection.escapeString(currentObject["label"])}</option>);
				}
				else {
					optionElements.push(<option key={currentObject} value={currentObject}>{Selection.escapeString(currentObject)}</option>);
				}
			}
		}
		else {
			for(let objectName in options) {
				optionElements.push(<option key={objectName} value={objectName}>{Selection.escapeString(options[objectName])}</option>);
			}
		}
		
		return <wrapper>{optionElements}</wrapper>;
	}
	
	static escapeString(aText) {
		if(!Selection.tempTextArea) {
			Selection.tempTextArea = document.createElement("textarea");
		}
		
		Selection.tempTextArea.innerHTML = aText;
		return Selection.tempTextArea.value;
	}
}

Selection.tempTextArea = null;

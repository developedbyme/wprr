import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

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
		returnObject["value"] = this.getSourcedProp("selection");
		
		return returnObject;
	}
		
	componentWillMount() {
		
	}
	
	_callback_change(aEvent) {
		//console.log("Selection::_callback_change");
		//console.log(aEvent);
		//console.log(aEvent.target.value);
		
		let value = aEvent.target.value;
		let additionalData = this.props.additionalData;
		
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
		
		if(this.props.valueName) {
			this.getReference("value/" + this.props.valueName).updateValue(this.props.valueName, aEvent.target.value, additionalData);
		}
		if(this.props.triggerName) {
			this.getReference("trigger/" + this.props.triggerName).trigger(this.props.triggerName, {"value": aEvent.target.value, "additionalData": additionalData});
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
					optionElements.push(<option key={currentObject["value"]} ref={"option-" + currentObject["value"]} value={currentObject["value"]}>{currentObject["label"]}</option>);
				}
				else {
					optionElements.push(<option key={currentObject} value={currentObject}>{currentObject}</option>);
				}
			}
		}
		else {
			for(let objectName in options) {
				optionElements.push(<option key={objectName} value={objectName}>{options[objectName]}</option>);
			}
		}
		
		return <wrapper>{optionElements}</wrapper>;
	}

}

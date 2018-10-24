import React from "react";

import Adjust from "wprr/manipulation/Adjust";

import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import Control from "wprr/manipulation/Control";
export default class Control extends Adjust {

	constructor(props) {
		super(props);
	}
	
	_getControlFunctions() {
		
		let returnArray = new Array();
		
		let adjustArray = this._getAdjustFunctions();
		let currentArray = adjustArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentFunction = currentArray[i];
			if(currentFunction instanceof ControlFunction) {
				returnArray.push(currentFunction);
			}
		}
		
		return returnArray;
	}
	
	_getControlReferences(aReturnObject) {
		let controlFunctions = this._getControlFunctions();
		
		let currentArray = controlFunctions;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			currentObject.injectReferences(aReturnObject);
		}
	}
	
	componentWillMount() {
		let controlFunctions = this._getControlFunctions();
		
		let currentArray = controlFunctions;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			currentObject.addOwner(this);
		}
	}
	
	componentWillUnmount() {
		let controlFunctions = this._getControlFunctions();
		
		let currentArray = controlFunctions;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			currentObject.removeOwner(this);
		}
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		let injectData = new Object();
		
		this._getControlReferences(injectData);
		
		return React.createElement(ReferenceInjection, {injectData: injectData}, clonedElements);
	}
}

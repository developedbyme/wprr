import React from "react";

import Adjust from "wprr/manipulation/Adjust";

import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import Control from "wprr/manipulation/Control";
export default class Control extends Adjust {

	constructor(props) {
		super(props);
		
		this._ownedControlFunctions = new Array();
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
	
	_getChanges(aNewFunctions) {
		let noChangeArray = new Array();
		
		let currentArray2 = [].concat(aNewFunctions);
		let currentArray2Length = currentArray2.length;
		
		let currentArray = [].concat(this._ownedControlFunctions);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let isFound = false;
			let currentExisitngFunction = currentArray[i];
			for(let j = 0 ; j < currentArray2Length; j++) {
				let currentAddedFunction = currentArray2[j];
				if(currentExisitngFunction === currentAddedFunction) {
					noChangeArray.push(currentAddedFunction);
					isFound = true;
					currentArray2.splice(j, 1);
					currentArray2Length--;
					break;
				}
			}
			
			if(isFound) {
				currentArray.splice(i, 1);
				currentArrayLength--;
			}
		}
		
		return {"added": currentArray2, "removed": currentArray, "noChange": noChangeArray};
	}
	
	_updateControlFunctions() {
		
		let newOwnedFunctions = new Array();
		
		let controlFunctions = this._getControlFunctions();
		
		let changes = this._getChanges(controlFunctions);
		
		let currentArray = changes.added;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			currentObject.addOwner(this);
			newOwnedFunctions.push(currentObject);
		}
		
		this._removeOwnerFromControlFunctions(changes.removed);
		this._ownedControlFunctions = controlFunctions;
	}
	
	componentDidMount() {
		//console.log("componentDidMount");
		//console.log(this);
		
		this._updateControlFunctions();
	}
	
	componentDidUpdate() {
		//console.log("componentDidUpdate");
		//console.log(this);
		
		this._updateControlFunctions();
	}
	
	_removeOwnerFromControlFunctions(aControlFunctions) {
		let currentArray = aControlFunctions;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			currentObject.removeOwner(this);
		}
		
		currentArray.splice(0, currentArrayLength);
	}
	
	componentWillUnmount() {
		//console.log("componentWillUnmount");
		//console.log(this);
		
		this._removeOwnerFromControlFunctions(this._ownedControlFunctions);
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		let injectData = new Object();
		
		this._getControlReferences(injectData);
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}

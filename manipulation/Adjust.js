import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

//import Adjust from "wprr/manipulation/Adjust";
export default class Adjust extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/Adjust::_removeUsedProps");
		
		delete aReturnObject["adjust"];
		
		return aReturnObject;
	}
	
	_adjust(aAdjust, aReturnObject) {
		if(aAdjust instanceof AdjustFunction) {
			return aAdjust.adjust(aReturnObject, this);
		}
		else if(typeof(aAdjust) === "function") {
			return aAdjust(aReturnObject, this);
		}
		else {
			console.error("Unknown type for adjust.", aAdjust, this);
		}
		
		return aReturnObject;
	}
	
	_getAdjustFunctions() {
		let adjust = this.getSourcedProp("adjust");
		if(adjust) {
			if(adjust instanceof Array) {
				return adjust
			}
			else {
				return [adjust];
			}
		}
		
		return [];
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/Adjust::_manipulateProps");
		
		let adjustArray = this._getAdjustFunctions();
		
		let currentObject = aReturnObject;
		
		if(adjustArray.length > 0) {
			let currentArray = adjustArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				currentObject = this._adjust(currentArray[i], currentObject);
			}
		}
		else {
			console.warn("Adjust is not set");
		}
		
		return currentObject;
	}
}

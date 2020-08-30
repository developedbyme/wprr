import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

//import InsertElement from "wprr/manipulation/InsertElement";
export default class InsertElement extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		
		delete aReturnObject["element"];
		delete aReturnObject["canBeEmpty"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/manipulation/InsertElement::_getChildToClone");
		//console.log(this);
		
		let originalChildren = super._getChildrenToClone();
		
		let insertedElement = this.getSourcedProp("element");
		
		if(!insertedElement) {
			let canBeEmpty = this.getSourcedProp("canBeEmpty");
			if(canBeEmpty) {
				return [];
			}
			console.error("No element set. Can't insert.", this);
			return [React.createElement("div", {},
				React.createElement("div", {"className": "react-error wprr-error"}, "No element set. Can't insert.")
			)];
		}
		
		let returnArray = Wprr.utils.array.singleOrArray(insertedElement);
		
		{
			let currentArray = returnArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentElement = currentArray[i];
				if(currentElement.type === undefined) {
					console.error("Element type is undefined. Can't insert.", currentElement, this);
					return [React.createElement("div", {},
						React.createElement("div", {"className": "react-error wprr-error"}, "Element type is undefined. Can't insert.")
					)];
				}
			}
		}
		
		return returnArray;
	}
}

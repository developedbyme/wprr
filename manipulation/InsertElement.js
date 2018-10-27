import React from "react";

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
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/manipulation/InsertElement::_getChildToClone");
		//console.log(this);
		
		let originalChildren = super._getChildrenToClone();
		
		let insertedElement = this.getSourcedProp("element");
		
		if(!insertedElement) {
			console.error("No element set. Can't insert.", this);
			return [React.createElement("div", {},
				React.createElement("div", {"className": "react-error wprr-error"}, "No element set. Can't insert.")
			)];
		}
		
		return [insertedElement];
	}
}

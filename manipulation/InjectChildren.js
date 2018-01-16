import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

//import InjectChildren from "wprr/manipulation/InjectChildren";
export default class InjectChildren extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/ManipulationBaseObject::_removeUsedProps");
		
		delete aReturnObject["dynamicChildren"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/manipulation/InjectChildren::_getChildToClone");
		//console.log(this);
		
		return this.getSourcedProp("dynamicChildren");
	}
}

import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import AddReference from "wprr/reference/AddReference";
export default class AddReference extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/AddReference::_removeUsedProps");
		
		delete aReturnObject["data"];
		delete aReturnObject["as"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let children = this.getProps()["children"];
		
		let injectData = new Object();
		injectData[this.getFirstInput("as")] = this.getFirstInput("data");
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, children);
	}
}

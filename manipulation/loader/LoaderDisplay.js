import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import LoaderDisplay from "wprr/manipulation/loader/LoaderDisplay";
export default class LoaderDisplay extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._propsThatShouldNotCopy.push("status");
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/loader/LoaderDisplay::_removeUsedProps");
		
		delete aReturnObject["status"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/manipulation/loader/LoaderDisplay::_getChildrenToClone");
		
		let status = this.getSourcedProp("status");
		
		if(status === 1) {
			return super._getChildrenToClone();
		}
		else {
			let currentComponenent = this.getReference("loaderDisplay/" + status);
			if(currentComponenent) {
				return [currentComponenent];
			}
			return [];
		}
	}
}

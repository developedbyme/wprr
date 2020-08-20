import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import UpdateCheck from "wprr/elements/abstract/UpdateCheck";
export default class UpdateCheck extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._lastChecksum = null;
		this.state["debugUpdateCount"] = 0;
	}
	
	_removeUsedProps(aReturnObject) {
		
		super._removeUsedProps(aReturnObject);
		
		delete aReturnObject["checksum"];
		
		return aReturnObject;
	}
	
	shouldComponentUpdate(aNextProps, aNextStates) {
		//console.log("shouldComponentUpdate");
		
		let checksum = this.getSourcedPropInAdjust("checksum", aNextProps);
		
		if(typeof(checksum) === "object" || typeof(checksum) === "array") {
			checksum = JSON.stringify(checksum);
		}
		
		if(checksum !== this._lastChecksum) {
			this._lastChecksum = checksum;
			this.state["debugUpdateCount"]++;
			return true;
		}
		
		return false;
	}
	
	_prepareInitialRender() {
		let checksum = this.getFirstInput("checksum");
		
		if(typeof(checksum) === "object" || typeof(checksum) === "array") {
			checksum = JSON.stringify(checksum);
		}
		
		this._lastChecksum = checksum;
	}
}

import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import IgnoreUpdates from "wprr/manipulation/IgnoreUpdates";
export default class IgnoreUpdates extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	shouldComponentUpdate(aNextProps, aNextStates) {
		console.log("wprr/manipulation/IgnoreUpdates::shouldComponentUpdate");
		
		return false;
	}
}

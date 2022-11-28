import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import IgnoreUpdates from "wprr/manipulation/IgnoreUpdates";
export default class IgnoreUpdates extends ManipulationBaseObject {

	_construct() {
		super._construct();
	}
	
	shouldComponentUpdate(aNextProps, aNextStates) {
		//console.log("wprr/manipulation/IgnoreUpdates::shouldComponentUpdate");
		
		return false;
	}
}

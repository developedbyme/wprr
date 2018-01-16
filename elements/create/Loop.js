import React from "react";

import Adjust from "wprr/manipulation/Adjust";

import ContentCreatorLoop from "wprr/manipulation/adjustfunctions/loop/ContentCreatorLoop";

//import Loop from "wprr/elements/create/Loop";
export default class Loop extends Adjust {
	
	constructor(props) {
		super(props);
		
		this._loopAdjustFunction = ContentCreatorLoop.create();
	}
	
	_getAdjustFunctions() {
		let returnArray = super._getAdjustFunctions();
		
		returnArray.push(this._loopAdjustFunction);
		
		return returnArray;
	}
}
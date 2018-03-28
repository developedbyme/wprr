import React from "react";

import Adjust from "wprr/manipulation/Adjust";

import ContentCreatorLoop from "wprr/manipulation/adjustfunctions/loop/ContentCreatorLoop";
import InjectChildren from "wprr/manipulation/InjectChildren";

//import Loop from "wprr/elements/create/Loop";
export default class Loop extends Adjust {
	
	constructor(props) {
		super(props);
		
		this._loopAdjustFunction = ContentCreatorLoop.create();
	}
	
	_addAdjustFunctions(aReturnArray) {
		aReturnArray.push(this._loopAdjustFunction);
	}
	
	_getAdjustFunctions() {
		let returnArray = super._getAdjustFunctions();
		
		this._addAdjustFunctions(returnArray);
		
		return returnArray;
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		if(children.length === 0) {
			children = [<InjectChildren />];
		}
		
		return children;
	}
}
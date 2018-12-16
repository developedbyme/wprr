import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import MarkupPlacement from "wprr/markup/MarkupPlacement";
export default class MarkupPlacement extends ManipulationBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/markup/MarkupPlacement::_removeUsedProps");
		
		delete aReturnObject["placement"];
		delete aReturnObject["passOnInjection"];
		
		return aReturnObject;
	}
}

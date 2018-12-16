import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

//import UseMarkup from "wprr/markup/UseMarkup";
export default class UseMarkup extends ManipulationBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_createClonedElement() {
		//console.log("wprr/markup/Markup::_createClonedElement");
		
		var injectChildren = ReactChildFunctions.getInputChildrenForComponent(this);
		var markup = this.getSourcedProp("markup");
		
		var mainElementProps = this._getMainElementProps();
		
		delete mainElementProps["dynamicChildren"];
		delete mainElementProps["markup"];
		
		mainElementProps["injectChildren"] = injectChildren;
		
		var clonedElement = React.createElement(ManipulationBaseObject, mainElementProps, markup);
		
		this._clonedElement = clonedElement;
	}
}

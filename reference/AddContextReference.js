import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import AddContextReference from "wprr/reference/AddContextReference";
export default class AddContextReference extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._contextValueFunctionBound = this._contextValueFunction.bind(this);
		this._referenceInjectionElement = null;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/AddContextReference::_removeUsedProps");
		
		delete aReturnObject["context"];
		delete aReturnObject["referencePath"];
		
		return aReturnObject;
	}
	
	_contextValueFunction(aValue) {
		
		let referencePath = this.getSourcedProp("referencePath");
		
		let injectData = new Object();
		injectData[referencePath] = aValue;
		
		return React.createElement(ManipulationBaseObject, {"injectData": injectData}, this._referenceInjectionElement);
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let CurrentContext = this.getSourcedProp("context");
		
		if(CurrentContext && CurrentContext.Consumer) {
			this._referenceInjectionElement = React.createElement(ReferenceInjection, {}, clonedElements);
		
			return React.createElement(CurrentContext.Consumer, {}, this._contextValueFunctionBound);
		}
		
		console.error("Context doesn't have a consumer.", CurrentContext, this);
		return clonedElements;
	}
	
	static createReactElement(aContext, aReferencePath, aChildOrChildren) {
		return React.createElement(AddContextReference, {"injectData": aContext, "referencePath": aReferencePath}, aChildOrChildren);
	}
}

import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceHolder from "wprr/reference/ReferenceHolder";
import SourceData from "wprr/reference/SourceData";

import WprrContext from "wprr/reference/WprrContext";

//import ReferenceInjection from "wprr/reference/ReferenceInjection";
export default class ReferenceInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._references = new ReferenceHolder();
	}
	
	getReferences() {
		return this._references;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ReferenceInjection::_removeUsedProps");
		
		delete aReturnObject["injectData"];
		
		return aReturnObject;
	}
	
	_getInjectData() {
		return this.getSourcedProp("injectData");
	}
	
	_prepareRender() {
		super._prepareRender();
		
		this._references.setParent(this.context.references);
		
		let injectData = this._getInjectData();
		
		for(let objectName in injectData) {
			let sourcedData = this.resolveSourcedData(injectData[objectName]);
			
			this._references.addObject(objectName, sourcedData);
		}
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		return React.createElement(WprrContext.Provider, {"value": {"references": this._references}}, clonedElements);
	}
	
	static createReactElement(aData, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"injectData": aData}, aChildOrChildren);
	}
}

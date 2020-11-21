import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceHolder from "wprr/reference/ReferenceHolder";
import SourceData from "wprr/reference/SourceData";

import WprrContext from "wprr/reference/WprrContext";

//import ReferenceInjection from "wprr/reference/ReferenceInjection";
export default class ReferenceInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._references = new ReferenceHolder();
		this._createInjectionObject();
	}
	
	_createInjectionObject() {
		this._injectionObject = {"value": {"references": this._references}};
	}
	
	getReferences() {
		//METODO: using a reference with the same name causing problems
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
		
		if(!injectData) {
			console.warn("No injectData prop set for injection.", this);
			return;
		}
		
		let hasData = false;
		
		if(Array.isArray(injectData)) {
			let currentArray = injectData;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentData = currentArray[i];
				
				let key = this.resolveSourcedData(currentData["key"]);
				let value = this.resolveSourcedData(currentData["value"]);
				
				this._references.addObject(key, value);
			}
			hasData = currentArrayLength > 0;
		}
		else {
			for(let objectName in injectData) {
				
				let value = injectData[objectName];
				
				if(!(value instanceof Wprr.utils.ValueSourceData)) {
					value = this.resolveSourcedData(value);
				}
				hasData = true;
				
				this._references.addObject(objectName, value);
			}
		}
		
		
		if(!hasData) {
			console.warn("Injection doesn't have any fields set.", this);
		}
	}
	
	_renderClonedElement() {
		//console.log("ReferenceInjection::_renderClonedElement", this);
		if(Wprr.development_updateFullTreeOnInjection) {
			this._createInjectionObject();
		}
		
		return React.createElement(WprrContext.Provider, this._injectionObject, this._cloneChildrenAndAddProps(this._getChildrenToClone()));
	}
	
	static createReactElement(aData, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"injectData": aData}, aChildOrChildren);
	}
}

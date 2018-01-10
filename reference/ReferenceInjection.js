import React from "react";
import PropTypes from "prop-types";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceHolder from "wprr/reference/ReferenceHolder";
import SourceData from "wprr/reference/SourceData";

//import ReferenceInjection from "wprr/reference/ReferenceInjection";
export default class ReferenceInjection extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._references = new ReferenceHolder();
	}
	
	getReferences() {
		return this._references;
	}
	
	getChildContext() {
		//console.log("wprr/reference/ReferenceInjection::getReferences")
		return {"references": this._references};
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
}

ReferenceInjection.childContextTypes = {
	"references": PropTypes.object
};

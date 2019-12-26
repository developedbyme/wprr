import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceHolder from "wprr/reference/ReferenceHolder";
import ReferenceExporter from "wprr/reference/ReferenceExporter";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import ReferenceRoot from "wprr/reference/ReferenceRoot";
export default class ReferenceRoot extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._referenceHolder = new ReferenceHolder();
	}
	
	getReferences() {
		return this._referenceHolder;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ReferenceRoot::removeUsedProps");
		
		delete aReturnObject["injectData"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let injectData = this.getSourcedProp("injectData");
		
		return React.createElement(ReferenceExporter, {"references": this._referenceHolder}, 
			React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements)
		);
	}
}
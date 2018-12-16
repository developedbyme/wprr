import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import WprrContext from "wprr/reference/WprrContext";

//import ReferenceExporter from "wprr/reference/ReferenceExporter";
export default class ReferenceExporter extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	getReferences() {
		return this.getSourcedProp("references");
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ReferenceExporter::removeUsedProps");
		
		delete aReturnObject["references"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let references = this.getSourcedProp("references");
		
		return React.createElement(WprrContext.Provider, {"value": {"references": references}}, clonedElements);
	}
}
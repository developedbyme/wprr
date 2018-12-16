import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import DeepDistribution from "wprr/manipulation/distribution/DeepDistribution";
export default class DeepDistribution extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		var distributionName = "default";
		
		let injectData = {};
		injectData["distributions/" + distributionName] = this._getMainElementProps();
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}

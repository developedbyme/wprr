import React from "react";
import {Fragment} from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SourceData from "wprr/reference/SourceData";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

// import FirstMatchingRoute from "wprr/routing/FirstMatchingRoute";
export default class FirstMatchingRoute extends ManipulationBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_evaluateQualify(aQualifier, aData) {
		if(!aQualifier) {
			console.error("Qualifier doesn't exist. Can't qualify.",  this);
			return false;
		}
		if(aQualifier.qualify && aQualifier.qualify(aData)) {
			return true;
		}
		
		return false;
	}
	
	_renderClonedElement() {
		//console.log("wprr/routing/FirstMatchingRoute::_renderClonedElement");
		
		let pageData = this.getSourcedPropWithDefault("pageData", FirstMatchingRoute.DEFAULT_PAGE_DATA_SOURCE);
		
		let currentArray = ReactChildFunctions.getInputChildrenForComponent(this);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentElement = currentArray[i];
			if(currentElement && currentElement.type === "route") {
				if(this._evaluateQualify(currentElement.props.qualify, pageData)) {
					let newChildren = ReactChildFunctions.getInputChildrenForComponent(currentElement);
					if(newChildren.length === 0) {
						console.warn(currentElement, " qualified but have no children.", this);
						return null;
					}
					return this._cloneChildrenAndAddProps(newChildren);
				}
			}
			else {
				console.warn(currentElement, "is not a route. Ignoring it.", this);
			}
		}
		
		console.warn("No route qualified.", this);
		return null;
	}
}

FirstMatchingRoute.DEFAULT_PAGE_DATA_SOURCE = SourceData.create("reference", "wprr/pageData");
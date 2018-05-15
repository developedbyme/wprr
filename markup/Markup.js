import React from "react";
import PropTypes from "prop-types";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

//import Markup from "wprr/markup/Markup";
export default class Markup extends ManipulationBaseObject {

	constructor(props) {
		super(props);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/markup/Markup::_removeUsedProps");
		
		delete aReturnObject["injectChildren"];
		delete aReturnObject["usedPlacements"];
		
		return aReturnObject;
	}
	
	_getMarkupChildren() {
		var children = this.getSourcedProp("injectChildren");
		
		return children;
	}
	
	_getTemplateChildren() {
		return ReactChildFunctions.getInputChildrenForComponent(this);
	}
	
	_getUsedPlacements() {
		var usedPlacements = this.getSourcedPropWithDefault("usedPlacements", []);
		
		if(typeof(usedPlacements) === "string") {
			usedPlacements = usedPlacements.split(",");
		}
		
		return usedPlacements;
	}
	
	getChildContext() {
		//console.log("wprr/markup/Markup::getChildContext");
		
		return {
			"markupUsedPlacements": this._getUsedPlacements(),
			"markupChildren": this._getMarkupChildren()
		};
	}
	
	_createClonedElement() {
		//console.log("wprr/markup/Markup::_createClonedElement");
		
		var returnArray = this._getTemplateChildren();
		
		if(returnArray.length === 0) {
			this._clonedElement = null;
		}
		else if(returnArray.length === 1) {
			this._clonedElement = this._performClone(returnArray[0], this._getMainElementProps());
		}
		else {
			var callArray = [React.Fragment, {}];
			callArray = callArray.concat(returnArray);
			
			this._clonedElement = React.createElement.apply(React, callArray);
		}
	}
}

Markup.childContextTypes = {
	"markupUsedPlacements": PropTypes.array,
	"markupChildren": PropTypes.array
};

import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SelectSection from "wprr/elements/area/SelectSection";
import SourceData from "wprr/reference/SourceData";

//import OnOffArea from "wprr/elements/area/OnOffArea";
export default class OnOffArea extends ManipulationBaseObject {

	constructor(props) {
		//console.log("wprr/elements/area/OnOffArea::constructor");
		super(props);
	}
	
	_manipulateProps(aReturnObject) {
		
		let currentValue = this.getSourcedProp("value");
		let trueValue = this.getSourcedPropWithDefault("trueValue", true);
		
		let compareType = this.getSourcedPropWithDefault("compareType", null);
		
		if(compareType === "notNull") {
			aReturnObject["selectedSections"] = (currentValue !== null) ? "on" : "off";
		}
		else if(compareType === "notEmpty") {
			let isEmpty = true;
			if(currentValue && currentValue.length > 0) {
				isEmpty = false;
			}
			aReturnObject["selectedSections"] = (!isEmpty) ? "on" : "off";
		}
		else {
			aReturnObject["selectedSections"] = (currentValue === trueValue) ? "on" : "off";
		}
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/elements/area/OnOffArea::_getChildToClone");
		//console.log(this);
		
		return [React.createElement(SelectSection, {}, this.props.children)];
	}
}

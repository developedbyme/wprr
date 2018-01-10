import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import SelectSection from "wprr/elements/area/SelectSection";

//import OnOffButton from "wprr/elements/interaction/OnOffButton";
export default class OnOffButton extends ManipulationBaseObject {

	constructor(props) {
		//console.log("wprr/elements/interaction/OnOffButton::constructor");
		super(props);
		
		this._mainElementType = "div";
		
		this._callback_changeBound = this._callback_change.bind(this);
	}
	
	_callback_change(aEvent) {
		//console.log("wprr/elements/interaction/OnOffButton::_callback_change");
		
		var valueName = this.getSourcedPropWithDefault("valueName", "value");
		var trueValue = this.getSourcedPropWithDefault("trueValue", true);
		var falseValue = this.getSourcedPropWithDefault("falseValue", false);
		
		var currentValue = this.props[valueName];
		var newValue = (currentValue === trueValue) ? falseValue : trueValue;
		
		this.getReferences().getObject("value/" + valueName).updateValue(valueName, newValue, this.props.additionalData);
	}
	
	_manipulateProps(aReturnObject) {
		aReturnObject["onClick"] = this._callback_changeBound;
		
		var valueName = this.getSourcedPropWithDefault("valueName", "value");
		var trueValue = this.getSourcedPropWithDefault("trueValue", true);
		
		var currentValue = this.props[valueName];
		
		aReturnObject["selectedSections"] = (currentValue === trueValue) ? "on" : "off";
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		//console.log("wprr/elements/interaction/OnOffButton::_getChildToClone");
		//console.log(this);
		
		return [<SelectSection>
			{this.props.children}
		</SelectSection>];
	}
}

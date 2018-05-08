import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import TriggerToValue from "wprr/reference/TriggerToValue";
export default class TriggerToValue extends ManipulationBaseObject {

	constructor(props) {
		super(props);
		
		
	}
	
	trigger(aName, aValue) {
		
		let triggerName = this.getSourcedProp("triggerName");
		
		if(aName === triggerName) {
			let valueName = this.getSourcedProp("valueName");
			
			let valueController = this.getReference("value/" + valueName);
			if(valueController) {
				valueController.updateValue(valueName, aValue);
			}
			else {
				console.warn("No controller for " + valueName + ". Can't update.", this);
			}
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/reference/TriggerToValue::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["triggerName"];
		delete returnObject["valueName"];
		
		return returnObject;
	}
	
	_renderClonedElement() {
		
		let triggerName = this.getSourcedProp("triggerName");
		
		let injectData = new Object();
		injectData["trigger/" + triggerName] = this;
		
		return <ReferenceInjection injectData={injectData}>{super._renderClonedElement()}</ReferenceInjection>;
	}
}

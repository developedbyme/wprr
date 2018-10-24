import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import TriggerHandler from "wprr/reference/TriggerHandler";
export default class TriggerHandler extends ManipulationBaseObject {

	constructor(props) {
		super(props);
		
		
	}
	
	trigger(aName, aValue) {
		
		let triggers = this.getSourcedProp("triggers");
		
		if(triggers[aName]) {
			let triggerFunction = triggers[aName];
			triggerFunction(aName, aValue, this);
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/reference/TriggerHandler::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["triggers"];
		
		return returnObject;
	}
	
	_renderClonedElement() {
		
		let triggers = this.getSourcedProp("triggers");
		
		let injectData = new Object();
		for(let objectName in triggers) {
			injectData["trigger/" + objectName] = this;
		}
		
		return React.createElement(ReferenceInjection, {injectData: injectData}, super._renderClonedElement());
	}
}

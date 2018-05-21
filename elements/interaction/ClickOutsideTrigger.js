import React from "react";
import ReactDOM from "react-dom";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ClickOutsideTrigger from "wprr/elements/interaction/ClickOutsideTrigger";
export default class ClickOutsideTrigger extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._callback_clickBound = this._callback_click.bind(this);
	}
	
	_callback_click(aEvent) {
		//console.log("wprr/elements/interaction/ClickOutsideTrigger::_callback_click");
		
		if(this.getSourcedProp("active")) {
			let triggerName = this.getSourcedProp("triggerName");
			
			let currentElement = ReactDOM.findDOMNode(this);
			
			if(!currentElement.contains(aEvent.srcElement)) {
				let triggerController = this.getReference("trigger/" + triggerName);
				if(triggerController) {
					let shouldStopClick = this.getSourcedPropWithDefault("shouldStopClick", true);
					if(shouldStopClick) {
						aEvent.preventDefault();
						aEvent.stopImmediatePropagation();
					}
					
					triggerController.trigger(triggerName, null);
				}
				else {
					console.warn("No controller for trigger " + triggerName, this);
				}
			}
		}
	}
	
	componentDidMount() {
		//console.log("wprr/elements/interaction/ClickOutsideTrigger::componentDidMount");
		
		document.body.addEventListener("click", this._callback_clickBound, true);
	}
	
	componentWillUnmount() {
		//console.log("wprr/elements/interaction/ClickOutsideTrigger::componentWillUnmount");
		
		document.body.removeEventListener("click", this._callback_clickBound, true);
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["triggerName"];
		delete returnObject["triggerData"];
		delete returnObject["active"];
		delete returnObject["shouldStopClick"];
		
		return returnObject;
	}
}
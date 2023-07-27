import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ScrollPosition from "wprr/manipulation/measure/ScrollPosition";
export default class ScrollPosition extends ManipulationBaseObject {

	_construct() {
		super._construct();
		
		this.state["scrollPosition"] = window.pageYOffset;
		
		this._callback_scrollUpdateBound = this._callback_scrollUpdate.bind(this);
		window.addEventListener("scroll", this._callback_scrollUpdateBound, false);
	}
	
	_updateScrollValue() {
		let currentScrollPosition = window.pageYOffset;
		
		if(currentScrollPosition !== this.state["scrollPosition"]) {
			this.setState({"scrollPosition": currentScrollPosition});
		}
	}
	
	_callback_scrollUpdate(aEvent) {
		//console.log("wprr/manipulation/measure/ScrollPosition::_callback_scrollUpdate");
		
		this._updateScrollValue();
	}
	
	componentDidUpdate() {
		super.componentDidUpdate();
		this._updateScrollValue();
	}
	
	componentWillUnmount() {
		//console.log("wprr/manipulation/measure/ScrollPosition::componentWillUnmount");
		
		super.componentWillUnmount();
		
		window.removeEventListener("scroll", this._callback_scrollUpdateBound, false);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/measure/ScrollPosition::_manipulateProps");
		
		aReturnObject["scrollPosition"] = this.state["scrollPosition"];
		
		return aReturnObject;
	}
}
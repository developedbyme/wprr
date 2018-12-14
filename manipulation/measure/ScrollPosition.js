import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ScrollPosition from "wprr/manipulation/measure/ScrollPosition";
export default class ScrollPosition extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["scrollPosition"] = 0;
		
		this._callback_scrollUpdateBound = this._callback_scrollUpdate.bind(this);
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
	
	componentDidMount() {
		//console.log("wprr/manipulation/measure/ScrollPosition::componentDidMount");
		
		super.componentDidMount();
		
		window.addEventListener("scroll", this._callback_scrollUpdateBound, false);
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
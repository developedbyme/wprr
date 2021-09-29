import React from "react";
import ReactDOM from "react-dom";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ElementSize from "wprr/manipulation/measure/ElementSize";
export default class ElementSize extends ManipulationBaseObject {

	constructor(props) {
		super(props);
		
		this.state["width"] = 0;
		this.state["height"] = 0;
		
		this._callback_sizeChangedBound = this._callback_sizeChanged.bind(this);
	}
	
	_updateWidth() {
		//console.log("wprr/manipulation/measure/ElementSize::_updateWidth");
		
		let domNode = ReactDOM.findDOMNode(this);
		
		let currentWidth = domNode.clientWidth;
		let currentHeight = domNode.clientHeight;
		
		if(currentWidth !== this.state["width"] || currentHeight !== this.state["height"]) {
			this.setState({"width": currentWidth, "height": currentHeight});
		}
		this.updateProp("width", currentWidth);
		this.updateProp("height", currentHeight);
	}
	
	_callback_sizeChanged(aEvent) {
		//console.log("wprr/manipulation/measure/ElementSize::_callback_sizeChanged");
		
		this._updateWidth();
	}
	
	componentDidMount() {
		//console.log("wprr/manipulation/measure/ElementSize::componentDidMount");
		
		this._updateWidth();
		
		window.addEventListener("resize", this._callback_sizeChangedBound, false);
	}
	
	componentDidUpdate() {
		//console.log("wprr/manipulation/measure/ElementSize::componentDidUpdate");
		
		this._updateWidth();
	}
	
	componentWillUnmount() {
		//console.log("wprr/manipulation/measure/ElementSize::componentWillUnmount");
		
		window.removeEventListener("resize", this._callback_sizeChangedBound, false);
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/measure/ElementSize::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		returnObject["width"] = this.state["width"];
		returnObject["height"] = this.state["height"];
		
		return returnObject;
	}
}

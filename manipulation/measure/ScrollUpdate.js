import React from "react";
import ReactDOM from "react-dom";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import ScrollUpdate from "wprr/manipulation/measure/ScrollUpdate";
export default class ScrollUpdate extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._element = null;
		
		this._callback_scrollUpdateBound = this._callback_scrollUpdate.bind(this);
	}
	
	_callback_scrollUpdate(aEvent) {
		//console.log("wprr/manipulation/measure/ScrollUpdate::_callback_scrollUpdate");
		
		window.wprr.imageLoaderManager.updateAllUninitiatedImages();
	}
	
	componentDidMount() {
		//console.log("wprr/manipulation/measure/ScrollUpdate::componentDidMount");
		
		let currentElement = ReactDOM.findDOMNode(this);
		this._element = currentElement;
		
		this._element.addEventListener("scroll", this._callback_scrollUpdateBound, false);
	}
	
	componentWillUnmount() {
		//console.log("wprr/manipulation/measure/ScrollUpdate::componentWillUnmount");
		
		this._element.removeEventListener("scroll", this._callback_scrollUpdateBound, false);
	}
}

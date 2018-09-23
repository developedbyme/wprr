import React from "react";
import ReactDOM from "react-dom";

import WprrBaseObject from "wprr/WprrBaseObject";

//import NativeElementArea from "wprr/elements/area/NativeElementArea";
export default class NativeElementArea extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this._element = null;
	}
	
	_createElement() {
		return document.createElement("div");
	}
	
	_updateRender() {
		
	}
	
	componentWillMount() {
		this._element = this._createElement("div");
	}
	
	componentDidUpdate() {
		let domNode = ReactDOM.findDOMNode(this);
		
		if(this._element.parentNode !== domNode) {
			domNode.appendChild(this._element);
		}
		
		this._updateRender();
	}
	
	_renderMainElement() {
		
		return <wrapper />;
	}
}

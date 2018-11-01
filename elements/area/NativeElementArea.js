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
	
	componentDidMount() {
		this.componentDidUpdate();
	}
	
	componentDidUpdate() {
		let domNode = ReactDOM.findDOMNode(this);
		
		if(this._element.parentNode !== domNode) {
			domNode.appendChild(this._element);
		}
		
		try {
			this._updateRender();
		}
		catch(theError) {
			let errorProperties = new Array();
			if(theError.fileName) {
				errorProperties.push("fileName: " + theError.fileName);
			}
			if(theError.sourceURL) {
				errorProperties.push("sourceURL: " + theError.sourceURL);
			}
			if(theError.lineNumber) {
				errorProperties.push("lineNumber: " + theError.lineNumber);
			}
			if(theError.line) {
				errorProperties.push("lineNumber: " + theError.line);
			}
			if(theError.stack) {
				errorProperties.push("stack: " + theError.stack);
			}
	
			let errorString = theError.message +" (" + errorProperties.join(", ") + ")";
	
			console.error(this, theError, errorString);
		}
	}
	
	_renderMainElement() {
		
		return React.createElement("wrapper");
	}
}

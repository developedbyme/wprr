import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import NativeElementArea from "wprr/elements/area/NativeElementArea";
export default class NativeElementArea extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._element = this._createElement();
	}
	
	_createElement() {
		return document.createElement("div");
	}
	
	_updateRender() {
		let commands = this.getSourcedProp("renderCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, this._element, this);
		}
	}
	
	componentDidMount() {
		super.componentDidMount();
		this._addAndUpdate();
	}
	
	componentDidUpdate() {
		super.componentDidUpdate();
		this._addAndUpdate();
	}
	
	_addAndUpdate() {
		let domNode = this.getMainElement();
		
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
	
	_prepareInitialRender() {
		let commands = this.getSourcedProp("setupCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, this._element, this);
		}
	}
	
	_renderMainElement() {
		
		return React.createElement("wrapper");
	}
}

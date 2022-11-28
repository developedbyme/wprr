import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import EventCommands from "wprr/elements/interaction/EventCommands";

//import DragArea from "wprr/elements/interaction/DragArea";
export default class DragArea extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._startX = 0;
		this._startY = 0;
		this._startPositionX = 0;
		this._startPositionY = 0;
		
		this._mouseDownCommands = Wprr.commands.callFunction(this, this.startDrag, [Wprr.source("event", "raw", "pageX"), Wprr.source("event", "raw", "pageY")]);
		this._callback_mouseMoveBound = this._callback_mouseMove.bind(this);
		this._callback_mouseUpBound = this._callback_mouseUp.bind(this);
	}
	
	_manipulateProps(aReturnObject) {
		
		let returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["externalStorage"];
		delete returnObject["valueNameX"];
		delete returnObject["valueNameY"];
		delete returnObject["envelopeX"];
		delete returnObject["envelopeY"];
		
		return returnObject;
	}
	
	startDrag(aPositionX, aPositionY) {
		//console.log("startDrag");
		//console.log(aPositionX, aPositionY);
		
		let externalStorage = this.getFirstInput("externalStorage");
		
		if(!externalStorage) {
			console.error("No external storage, can't start drag.", this);
			return;
		}
		
		let valueNameX = this.getFirstInput("valueNameX");
		if(valueNameX) {
			this._startX = externalStorage.getValue(valueNameX);
		}
		let valueNameY = this.getFirstInput("valueNameY");
		if(valueNameY) {
			this._startY = externalStorage.getValue(valueNameY);
		}
		
		this._startPositionX = aPositionX;
		this._startPositionY = aPositionY;
		
		document.addEventListener("mousemove", this._callback_mouseMoveBound, false);
		document.addEventListener("mouseup", this._callback_mouseUpBound, false);
	}
	
	_callback_mouseMove(aEvent) {
		//console.log("_callback_mouseMove");
		//console.log(aEvent);
		
		let externalStorage = this.getFirstInput("externalStorage");
		
		let valueNameX = this.getFirstInput("valueNameX");
		if(valueNameX) {
			let changedPosition = aEvent.pageX-this._startPositionX;
			let envelope = this.getFirstInputWithDefault("envelopeX", 1);
			if(envelope) {
				externalStorage.updateValue(valueNameX, this._startX+envelope*changedPosition);
			}
		}
		let valueNameY = this.getFirstInput("valueNameY");
		if(valueNameY) {
			let changedPosition = aEvent.pageY-this._startPositionY;
			let envelope = this.getFirstInputWithDefault("envelopeY", 1);
			if(envelope) {
				externalStorage.updateValue(valueNameY, this._startY+envelope*changedPosition);
			}
		}
	}
	
	_callback_mouseUp(aEvent) {
		//console.log("_callback_mouseUp");
		//console.log(aEvent);
		
		this._callback_mouseMove(aEvent);
		
		document.removeEventListener("mousemove", this._callback_mouseMoveBound, false);
		document.removeEventListener("mouseup", this._callback_mouseUpBound, false);
	}
	
	_getChildrenToClone() {
		//console.log("DragArea::_getChildrenToClone");
		let children = super._getChildrenToClone();
		
		return [
			React.createElement(EventCommands, {"events": {"onMouseDown": this._mouseDownCommands}}, children)
		];
	}
}

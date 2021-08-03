import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class DragElement extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateActiveCommand = Wprr.commands.callFunction(this, this._updateActive);
		this._updateElementCommand = Wprr.commands.callFunction(this, this._updateElement);
		
		this._elementWithListeners = null;
		this._parentWithListeners = null;
		
		this._callback_mouseDownBound = this._callback_mouseDown.bind(this);
		this._callback_mouseMoveBound = this._callback_mouseMove.bind(this);
		this._callback_mouseUpBound = this._callback_mouseUp.bind(this);
		
		this._callback_touchStartBound = this._callback_touchStart.bind(this);
		this._callback_touchMoveBound = this._callback_touchMove.bind(this);
		this._callback_touchEndBound = this._callback_touchEnd.bind(this);
		
		this._callback_clickBound = this._callback_click.bind(this);
		
		this._startDragTime = 0;
	}
	
	setup() {
		
		this.item.setValue("active", false);
		this.item.getType("active").addChangeCommand(this._updateActiveCommand);
		
		this.item.setValue("isDragging", false);
		
		this.item.setValue("valueX", 0);
		this.item.setValue("valueY", 0);
		
		this.item.setValue("startValueX", 0);
		this.item.setValue("startValueY", 0);
		
		this.item.setValue("startPositionX", 0);
		this.item.setValue("startPositionY", 0);
		
		this.item.setValue("envelopeX", 1);
		this.item.setValue("envelopeY", 1);
		
		this.item.setValue("element", null);
		this.item.getType("element").addChangeCommand(this._updateElementCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("dragElementController", this);
		this.setup();
		
		return this;
	}
	
	setElement(aElement) {
		this.item.setValue("element", aElement);
		
		return this;
	}
	
	start() {
		this.item.setValue("active", true);
	}
	
	stop() {
		this.item.setValue("active", false);
	}
	
	_updateElement() {
		console.log("_updateElement");
		console.log(this);
		
		if(this._elementWithListeners) {
			this._elementWithListeners.removeEventListener("mousedown", this._callback_mouseDownBound, false);
			this._elementWithListeners.removeEventListener("touchstart", this._callback_touchStartBound, false);
			this._elementWithListeners.removeEventListener("click", this._callback_clickBound, true);
			this._elementWithListeners = null;
		}
		
		let element = this.item.getValue("element");
		let active = this.item.getValue("active");
		
		this.item.setValue("isDragging", false);
		if(this._parentWithListeners) {
			this._parentWithListeners.removeEventListener("mousemove", this._callback_mouseMoveBound, false);
			this._parentWithListeners.removeEventListener("mouseup", this._callback_mouseUpBound, false);
			this._parentWithListeners = null;
		}
		
		if(element) {
			if(active) {
				element.addEventListener("mousedown", this._callback_mouseDownBound, false);
				element.addEventListener("touchstart", this._callback_touchStartBound, false);
				element.addEventListener("click", this._callback_clickBound, true);
				this._elementWithListeners = element;
			}
		}
		
	}
	
	_updateActive() {
		console.log("_updateActive");
		console.log(this);
		
		let element = this.item.getValue("element");
		let active = this.item.getValue("active");
		
		this.item.setValue("isDragging", false);
		if(this._parentWithListeners) {
			this._parentWithListeners.removeEventListener("mousemove", this._callback_mouseMoveBound, false);
			this._parentWithListeners.removeEventListener("mouseup", this._callback_mouseUpBound, false);
			this._parentWithListeners = null;
		}
		
		if(element) {
			if(active) {
				element.addEventListener("mousedown", this._callback_mouseDownBound, false);
				element.addEventListener("touchstart", this._callback_touchStartBound, true);
				element.addEventListener("click", this._callback_clickBound, true);
				this._elementWithListeners = element;
			}
			else {
				this._elementWithListeners.removeEventListener("mousedown", this._callback_mouseDownBound, false);
				this._elementWithListeners.removeEventListener("touchstart", this._callback_touchStartBound, false);
				this._elementWithListeners.removeEventListener("click", this._callback_clickBound, true);
				this._elementWithListeners = null;
			}
		}
	}
	
	_callback_mouseDown(aEvent) {
		console.log("_callback_mouseDown");
		
		this._startDragTime = (new Date()).valueOf();
		
		this.item.setValue("isDragging", true);
		
		this.item.setValue("startValueX", this.item.getValue("valueX"));
		this.item.setValue("startValueY", this.item.getValue("valueY"));
		
		this.item.setValue("startPositionX", aEvent.pageX);
		this.item.setValue("startPositionY", aEvent.pageY);
		
		document.addEventListener("mousemove", this._callback_mouseMoveBound, true);
		document.addEventListener("mouseup", this._callback_mouseUpBound, true);
		this._parentWithListeners = document;
	}
	
	_callback_mouseMove(aEvent) {
		console.log("_callback_mouseMove");
		
		let movementX = aEvent.pageX-this.item.getValue("startPositionX");
		let movementY = aEvent.pageY-this.item.getValue("startPositionY");
		
		let newValueX = this.item.getValue("startValueX")+this.item.getValue("envelopeX")*movementX;
		let newValueY = this.item.getValue("startValueY")+this.item.getValue("envelopeY")*movementY;
		
		this.item.setValue("valueX", newValueX);
		this.item.setValue("valueY", newValueY);
	}
	
	_callback_mouseUp(aEvent) {
		console.log("_callback_mouseUp");
		
		this.item.setValue("isDragging", false);
		
		if(this._parentWithListeners) {
			this._parentWithListeners.removeEventListener("mousemove", this._callback_mouseMoveBound, true);
			this._parentWithListeners.removeEventListener("mouseup", this._callback_mouseUpBound, true);
			this._parentWithListeners = null;
		}
	}
	
	_callback_touchStart(aEvent) {
		console.log("_callback_touchStart");
		
		let touches = aEvent.changedTouches;
		let touch = touches[0];
		
		this._startDragTime = (new Date()).valueOf();
		
		this.item.setValue("isDragging", true);
		
		this.item.setValue("startValueX", this.item.getValue("valueX"));
		this.item.setValue("startValueY", this.item.getValue("valueY"));
		
		this.item.setValue("startPositionX", touch.pageX);
		this.item.setValue("startPositionY", touch.pageY);
		
		document.addEventListener("touchmove", this._callback_touchMoveBound, true);
		document.addEventListener("touchend", this._callback_touchEndBound, true);
		this._parentWithListeners = document;
	}
	
	_callback_touchMove(aEvent) {
		
		let touches = aEvent.changedTouches;
		let touch = touches[0];
		
		let movementX = touch.pageX-this.item.getValue("startPositionX");
		let movementY = touch.pageY-this.item.getValue("startPositionY");
		
		let newValueX = this.item.getValue("startValueX")+this.item.getValue("envelopeX")*movementX;
		let newValueY = this.item.getValue("startValueY")+this.item.getValue("envelopeY")*movementY;
		
		this.item.setValue("valueX", newValueX);
		this.item.setValue("valueY", newValueY);
	}
	
	_callback_touchEnd(aEvent) {
		this.item.setValue("isDragging", false);
		
		if(this._parentWithListeners) {
			this._parentWithListeners.removeEventListener("touchmove", this._callback_touchMoveBound, true);
			this._parentWithListeners.removeEventListener("touchend", this._callback_touchEndBound, true);
			this._parentWithListeners = null;
		}
	}
	
	_callback_click(aEvent) {
		console.log("_callback_click");
		
		let currentTime = (new Date()).valueOf();
		
		if((currentTime-this._startDragTime)/1000 > 0.2) {
			aEvent.preventDefault();
		}
	}
	
	toJSON() {
		return "[DragElement id=" + this._id + "]";
	}
	
	static create(aItem, aElement = null) {
		let newDragElement = new DragElement();
		newDragElement.setupForItem(aItem);
		newDragElement.setElement(aElement);
		
		return newDragElement;
	}
}
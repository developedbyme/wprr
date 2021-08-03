import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";
import TWEEN from "@tweenjs/tween.js";

export default class Slider extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._lastMovement = (new Date()).valueOf();
		
		this._updateAutoMoveStateCommand = Wprr.commands.callFunction(this, this._updateAutoMoveState);
		this._positionUpdatedCommand = Wprr.commands.callFunction(this, this._positionUpdated);
		
		this._callback_requestAnimationFrameBound = this._callback_requestAnimationFrame.bind(this);
	}
	
	setup() {
		
		this.item.setValue("position", 0);
		this.item.getType("position").addChangeCommand(this._positionUpdatedCommand);
		this.item.setValue("activeItem", 0);
		this.item.setValue("numberOfItems", 0);
		this.item.setValue("interval", 7);
		this.item.setValue("autoMove", false);
		this.item.getType("autoMove").addChangeCommand(this._updateAutoMoveStateCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("sliderController", this);
		this.setup();
		
		return this;
	}
	
	_positionUpdated() {
		this._lastMovement = (new Date()).valueOf();
		
		let roundedPosition = Math.round(this.item.getValue("position"));
		let activeItem = roundedPosition%this.item.getValue("numberOfItems");
		this.item.setValue("activeItem", activeItem);
	}
	
	_updateAutoMoveState() {
		//console.log("_updateAutoMoveState");
		if(this.item.getValue("autoMove")) {
			this._performStart();
		}
	}
	
	_performStart() {
		//console.log("_performStart");
		
		this._lastMovement = (new Date()).valueOf();
		requestAnimationFrame(this._callback_requestAnimationFrameBound);
	}
	
	start() {
		//console.log("start");
		
		this.item.setValue("autoMove", true);
		
		return this;
	}
	
	stop() {
		this.item.setValue("autoMove", false);
		
		return this;
	}
	
	_callback_requestAnimationFrame() {
		//console.log("_callback_requestAnimationFrame");
		if(this.item.getValue("autoMove")) {
			requestAnimationFrame(this._callback_requestAnimationFrameBound);
			
			let currentTime = (new Date()).valueOf();
			
			let intervalLength = this.item.getValue("interval");
			if((currentTime-this._lastMovement)/1000 >= intervalLength) {
				let nextPosition = Math.floor(this.item.getValue("position")+1);
				
				this._lastMovement = currentTime;
				this.animateToPosition(nextPosition, 0.8);
			}
		}
		
	}
	
	animateToClosestIndex(aIndex, aTime = 0.8) {
		//console.log("animateToClosestIndex");
		
		let position = this.item.getValue("position");
		let numberOfItems = this.item.getValue("numberOfItems");
		let times = Math.ceil(position/numberOfItems);
		
		if(isNaN(times)) {
			console.error("Closest position can't be retreived.", this);
			return;
		}
		
		
		let nextIndex = times*numberOfItems+aIndex;
		let previousIndex = (times-1)*numberOfItems+aIndex;
		
		if(Math.abs(nextIndex-position) === Math.abs(previousIndex-position)) {
			
			var localPosition = position-(Math.floor(position/numberOfItems)*numberOfItems);
			if(aIndex < localPosition) {
				this.animateToPosition(previousIndex, aTime);
			}
			else {
				this.animateToPosition(nextIndex, aTime);
			}
		}
		else if(Math.abs(nextIndex-position) < Math.abs(previousIndex-position)) {
			this.animateToPosition(nextIndex, aTime);
		}
		else {
			this.animateToPosition(previousIndex, aTime);
		}
		
		return this;
	}
	
	animateToPosition(aPosition, aTime = 0.8) {
	
		this.item.getType("position").animateValue(aPosition, aTime, TWEEN.Easing.Quadratic.Out);
		
		return this;
	}
	
	animateToPreviousPosition(aTime = 0.8) {
		this.animateSteps(-1, aTime);
		
		return this;
	}
	
	animateToNextPosition(aTime = 0.8) {
		this.animateSteps(1, aTime);
		
		return this;
	}
	
	animateSteps(aSteps, aTime = 0.8) {
		let nextPosition = Math.round(this.item.getValue("position"))+aSteps;
		
		this.animateToPosition(nextPosition, aTime)
		
		return this;
	}
	
	toJSON() {
		return "[Slider id=" + this._id + "]";
	}
	
	static create(aItem, aNumberOfItems = null, aInterval = -1) {
		let newSlider = new Slider();
		newSlider.setupForItem(aItem);
		if(aNumberOfItems) {
			aItem.setValue("numberOfItems", aNumberOfItems);
		}
		if(aInterval > 0) {
			aItem.setValue("interval", aInterval);
			newSlider.start();
		}
		
		return newSlider;
	}
}
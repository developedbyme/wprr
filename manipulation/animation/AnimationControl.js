import React from "react";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import TWEEN from "@tweenjs/tween.js";
import objectPath from "object-path";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import AnimationControl from "wprr/manipulation/animation/AnimationControl";
export default class AnimationControl extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._propsThatShouldNotCopy.push("state");
		this._propsThatShouldNotCopy.push("states");
		
		this._animationParts = new Array();
		
		this._lastState = "initial";
		this._tweenParameters = new Object();
		
		this._updateTweenBound = this.updateTween.bind(this);
		
		this._tween = null;
	}
	
	addAnimationPart(aPart) {
		this._animationParts.push(aPart);
		aPart.updateAnimation(this._tweenParameters);
	}
	
	updateTween() {
		let currentArray = this._animationParts;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentAnimationPart = currentArray[i];
			currentAnimationPart.updateAnimation(this._tweenParameters);
		}
	}
	
	runCompleteCommands(aCommands) {
		CommandPerformer.perform(aCommands, null, this);
	}
	
	animate(aValues, aTime, aEasingFunction, aDelay = 0, aCompleteCommands = null) {
		
		let completeCallback = (function() {
			this._tween = null;
			if(aCompleteCommands) {
				this.runCompleteCommands(aCompleteCommands);
			}
		}).bind(this);
		
		this._tween = new TWEEN.Tween(this._tweenParameters).to(aValues, 1000*aTime).onStart(function(aTweenParameters) {
			for(let objectName in this._valuesStart) {
				this._valuesStart[objectName] = aTweenParameters[objectName] ? aTweenParameters[objectName] : 0;
			}
		}).easing(aEasingFunction).delay(1000*aDelay).onUpdate(this._updateTweenBound).onComplete(completeCallback).start();
		
		return this;
	}
	
	animateToState(aName, aTime, aEasingFunction, aDelay = 0, aCompleteCommands = null) {
		
		let stateValues = this.getStateValues(aName);
		
		if(stateValues) {
			this.animate(stateValues, aTime, aEasingFunction, aDelay, aCompleteCommands);
			this._lastState = aName;
			
			let valueController = this.getReference("value/state");
			if(valueController) {
				valueController.updateValue("state", aName);
			}
		}
		else {
			console.warn("No state named " + aName + ". Ignoring animation.", this);
		}
		
		return this;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/animation/AnimationControl::_removeUsedProps");
		
		delete aReturnObject["state"];
		delete aReturnObject["states"];
		
		return aReturnObject;
	}
	
	getStateValues(aName) {
		let states = this.getSourcedPropWithDefault("states", null);
		
		if(states) {
			if(states[aName]) {
				//METODO: resolve properties
				return states[aName];
			}
			console.warn("Animation control has no state named " + aName + ".", this);
		}
		else {
			console.error("Animation control has no states.", this);
		}
		
		return {};
	}
	
	componentDidUpdate() {
		let newState = this.getSourcedProp("state");
		
		if(newState && (newState !== this._lastState)) {
			this.animate(this.getStateValues(newState), 0.5, TWEEN.Easing.Quadratic.Out);
			this._lastState = newState;
		}
	}
	
	_prepareInitialRender() {
		let newState = this.getSourcedPropWithDefault("state", "initial");
		
		let stateValues = this.getStateValues(newState);
		
		for(let objectName in stateValues) {
			this._tweenParameters[objectName] = stateValues[objectName];
		}
		
		this._lastState = newState;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let groupName = "animation";
		
		let injectData = {};
		injectData["control/" + groupName] = this;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
	
	static getEasing(aName) {
		let easingFunction = objectPath.get(TWEEN.Easing, aName);
		if(easingFunction) {
			return easingFunction;
		}
		
		console.warn("No easing function named " + aName + ". Using linear.");
		return TWEEN.Easing.Linear.None;
	}
}

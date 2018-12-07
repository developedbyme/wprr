import React from "react";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import TWEEN from "@tweenjs/tween.js";
import objectPath from "object-path";

//import AnimationControl from "wprr/manipulation/animation/AnimationControl";
export default class AnimationControl extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
		this._propsThatShouldNotCopy.push("state");
		this._propsThatShouldNotCopy.push("states");
		
		this._animationParts = new Array();
		
		this._lastState = "initial";
		this._tweenParameters = new Object();
		
		this._updateTweenBound = this.updateTween.bind(this);
		
		this._tween = null;
	}
	
	addAnimationPart(aPart) {
		console.log("wprr/manipulation/animation/AnimationControl::addAnimationPart");
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
		//METODO
	}
	
	animate(aValues, aTime, aEasingFunction, aCompleteCommands = null) {
		
		let completeCallback = (function() {
			this._tween = null;
			if(aCompleteCommands) {
				this.runCompleteCommands(aCompleteCommands);
			}
		}).bind(this);
		
		this._tween = new TWEEN.Tween(this._tweenParameters).to(aValues, 1000*aTime).easing(aEasingFunction).onUpdate(this._updateTweenBound).onComplete(completeCallback).start();
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
			this.animate(this.getStateValues(newState), 2, TWEEN.Easing.Quadratic.Out);
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

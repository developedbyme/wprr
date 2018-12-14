import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import AnimationApplyFunction from "wprr/manipulation/animation/applyfunctions/AnimationApplyFunction";
import OpacityApplyFunction from "wprr/manipulation/animation/applyfunctions/OpacityApplyFunction";
import TransformApplyFunction from "wprr/manipulation/animation/applyfunctions/TransformApplyFunction";
import ApplyAnimation from "wprr/manipulation/animation/applyfunctions/ApplyAnimation";

//import AnimationPart from "wprr/manipulation/animation/AnimationPart";
export default class AnimationPart extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._animationController = null; //METODO: use this to be able to update animation
		
		this.state["animationProps"] = new Object();
		this.state["animationStyles"] = new Object();
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/manipulation/animation/AnimationPart::_removeUsedProps");
		
		delete aReturnObject["state"];
		
		return aReturnObject;
	}
	
	updateAnimation(aAnimationValues) {
		//console.log("wprr/manipulation/animation/AnimationPart::updateAnimation");
		//console.log(aAnimationValues);
		
		let newProps = new Object();
		let newStyles = new Object();
		
		let animationFunctions = this.getSourcedProp("animationFunctions");
		
		if(animationFunctions) {
			if(typeof(animationFunctions) === "string") {
				//METODO: get default animations
			}
			
			let functionsArray = null;
			
			if(Array.isArray(animationFunctions)) {
				functionsArray = animationFunctions;
			}
			else {
				functionsArray = [animationFunctions];
			}
			
			let currentArray = functionsArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let curentFunction = currentArray[i];
				if(curentFunction instanceof AnimationApplyFunction) {
					curentFunction.applyAnimation(newProps, newStyles, aAnimationValues, this);
				}
				else {
					//METODO: check that it's a function
					curentFunction(newProps, newStyles, aAnimationValues, this);
				}
				
			}
		}
		else {
			console.warn("Animation part doesn't have any animation functions.", this);
		}
		
		this.setState({"animationProps": newProps, "animationStyles": newStyles});
	}
	
	_prepareInitialRender() {
		
		let groupName = this.getSourcedPropWithDefault("groupName", "animation")
		
		let animationController = this.getReference("control/" + groupName);
		
		if(animationController !== null) {
			animationController.addAnimationPart(this);
		}
		else {
			console.error("No animation controller.", this);
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/animation/AnimationPart::updateAnimation");
		
		//MEDEBUG: 
		aReturnObject["style"] = this.state["animationStyles"];
		
		return aReturnObject;
	}
}

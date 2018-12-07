import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

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
	
	_debug_animationFunction(aProps, aStyles, aAnimationValues, aElement) {
		aStyles["opacity"] = aAnimationValues.envelope;
	}
	
	updateAnimation(aAnimationValues) {
		//console.log("wprr/manipulation/animation/AnimationPart::updateAnimation");
		//console.log(aAnimationValues);
		
		let newProps = new Object();
		let newStyles = new Object();
		
		//METODO: move out animation functions
		this._debug_animationFunction(newProps, newStyles, aAnimationValues, this);
		
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

import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import StepController from "wprr/manipulation/StepController";
export default class StepController extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	getCurrentIndex() {
		let currentStep = this.getSourcedProp("step");
		
		let steps = this.getSourcedProp("steps");
		
		return this.getIndexForStep(currentStep);
	}
	
	getIndexForStep(aName) {
		let steps = this.getSourcedProp("steps");
		
		let returnIndex = steps.indexOf(aName);
		if(returnIndex >= 0) {
			return returnIndex;
		}
		
		console.error("Step " + currentStep + " is not found in [" + steps.join(", ") + "]", this);
		return -1;
	}
	
	go(aSteps) {
		let currentIndex = this.getCurrentIndex();
		
		if(currentIndex >= 0) {
			let newIndex = currentIndex+aSteps;
			this.goToIndex(newIndex);
		}
		else {
			console.error("Current step is unknown. Restting to first step.", this);
			this.goToIndex(0);
		}
	}
	
	next() {
		this.go(1);
	}
	
	previous() {
		this.go(-1);
	}
	
	goToStep(aName) {
		let index = this.getIndexForStep(aName);
		if(index >= 0) {
			this.goToIndex(index);
		}
	}
	
	goToIndex(aStepIndex) {
		let valueName = this.getSourcedPropWithDefault("valueName", "step");
		
		let stepController = this.getReference("value/" + valueName);
		
		let steps = this.getSourcedProp("steps");
		if(aStepIndex < 0) {
			console.warn("Step " + aStepIndex +" is too low.", this);
			aStepIndex = 0;
		}
		else if(aStepIndex >= steps.length) {
			console.warn("Step " + aStepIndex +" is too high.", this);
			aStepIndex = steps.length-1;
		}
		
		let newStep = steps[aStepIndex];
		
		if(stepController) {
			stepController.updateValue(valueName, newStep);
		}
		else {
			console.error("No contoller for value " + valueName + ". Can't update.", this);
		}
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let injectData = {};
		injectData["stepController"] = this;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}

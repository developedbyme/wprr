import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class Steps extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.getLinks("steps");
		this.item.setValue("currentStep", 0);
		this.item.setValue("completedSteps", []);
		
		this.item.getType("completedSteps").addChangeCommand(Wprr.commands.callFunction(this, this._updateCurrentStep));
		
		return this;
	}
	
	_updateActiveStep(aStep, aIndex, aCurrentStep) {
		//console.log("_updateActiveStep");
		//console.log(aStep, aIndex, aCurrentStep);
		
		aStep.setValue("active", aIndex === aCurrentStep);
	}
	
	createStep() {
		//console.log("createStep");
		
		let steps = this.item.getLinks("steps");
		
		let newItem = this.item.group.createInternalItem();
		steps.addItem(newItem.id);
		
		let currentStep = this.item.getType("currentStep");
		
		let currentIndex = steps.ids.length-1;
		newItem.setValue("active", currentStep.value === currentIndex);
		currentStep.addChangeCommand(Wprr.commands.callFunction(this, this._updateActiveStep, [newItem, currentIndex, currentStep]));
		
		return newItem;
	}
	
	stepCompleted(aIndex) {
		let completedSteps = this.item.getValue("completedSteps");
		if(completedSteps.indexOf(aIndex) === -1) {
			completedSteps = completedSteps.concat([aIndex]);
			this.item.setValue("completedSteps", completedSteps);
		}
		
		return this;
	}
	
	stepCompletedIf(aIndex, aValue, aMatchValue = true) {
		if(aValue === aMatchValue) {
			this.stepCompleted(aIndex);
		}
		
		return this;
	}
	
	multipleStepsCompleted(...aIndexes) {
		let indexes = [].concat(aIndexes).flat();
		let completedSteps = [].concat(this.item.getValue("completedSteps"));
		
		let currentArray = indexes;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentIndex = currentArray[i];
			if(completedSteps.indexOf(currentIndex) === -1) {
				completedSteps.push(currentIndex);
			}
		}
		
		this.item.setValue("completedSteps", completedSteps);
		
		return this;
	}
	
	_updateCurrentStep() {
		let completedSteps = this.item.getValue("completedSteps");
		let currentStep = this.item.getValue("currentStep");
		
		if(completedSteps.indexOf(currentStep) !== -1) {
			let nextStep = this._getNextAvailableStep(currentStep+1, completedSteps);
			this.item.setValue("currentStep", nextStep);
		}
	}
	
	_getNextAvailableStep(aIndex, aCompletedSteps) {
		if(aCompletedSteps.indexOf(aIndex) === -1) {
			return aIndex;
		}
		return this._getNextAvailableStep(aIndex+1, aCompletedSteps);
	}
	
	toJSON() {
		return "[Steps id=" + this._id + "]";
	}
}
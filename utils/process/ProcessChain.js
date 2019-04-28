import Wprr from "wprr/Wprr";

import ProcessPart from "wprr/utils/process/ProcessPart";

// import ProcessChain from "wprr/utils/process/ProcessChain";
export default class ProcessChain extends ProcessPart {
	
	constructor() {
		
		super();
		
		this._status = 0;
		
		this._currentStepIndex = -1;
		this._initialStep = Wprr.utils.process.ProcessPart.create().completeDirectlyWhenStarted();
		this._performedSteps = new Array();
	}
	
	setInitialStep(aStep) {
		this._initialStep = aStep;
		
		return this;
	}
	
	getStepByPathParts(aPathParts) {
		//console.log("wprr/utils/process/ProcessChain::getStepByPathParts");
		//console.log(aPathParts);
		
		let currentStep = this._initialStep;
		
		let currentArray = aPathParts;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			let nextStep = currentStep.getStep(currentName);
			
			if(!nextStep) {
				console.warn("No step " + currentName + " in path " + aPathParts.join("/") + " from step ", currentStep, this);
				return null;
			}
			
			currentStep = nextStep;
		}
		
		return currentStep;
	}
	
	getStepByPath(aPath) {
		let pathParts = aPath.split("/");
		let part = this.getStepByPathParts(pathParts);
		
		return part;
	}
	
	addStepToChain(aPath, aStep, aIsNext = true) {
		//console.log("wprr/utils/process/ProcessChain::addStepToChain");
		//console.log(aPath, aStep, aIsNext);
		
		let pathParts = aPath.split("/");
		let nextName = pathParts.pop();
		
		let fromPart = this.getStepByPathParts(pathParts);
		
		if(fromPart) {
			if(aIsNext) {
				fromPart.setNextStep(nextName, aStep);
			}
			else {
				fromPart.addStep(nextName, aStep);
			}
		}
		else {
			console.error("No part exists for path " + pathParts.join("/") + ". Can't add " + nextName, this);
		}
		
		return this;
	}
	
	addCommandStep(aPath, aCommandOrCommands, aCompleteDirectly = true, aIsNext = true) {
		let newPart = ProcessPart.create();
		
		newPart.addStartCommand(aCommandOrCommands);
		if(aCompleteDirectly) {
			newPart.completeDirectlyWhenStarted();
		}
		
		this.addStepToChain(aPath, newPart, aIsNext);
		
		return this;
	}
	
	linkStep(aPath, aToPath, aIsNext = true) {
		console.log("wprr/utils/process/ProcessChain::addStepToChain");
		console.log(aPath, aToPath, aIsNext);
		
		this.addStepToChain(aPath, this.getStepByPath(aToPath), aIsNext);
		
		return this;
	}
	
	start() {
		if(this._status === 0) {
			this._status = 2;
			this._performedSteps.push(this._initialStep);
			this._currentStepIndex = 0;
			this._startStep(this._initialStep);
		}
		
		return this;
	}
	
	continue() {
		//console.log("wprr/utils/process/ProcessChain::continue");
		
		this.getCurrentStep().continue();
	}
	
	_startStep(aStep) {
		aStep.setOwner(this);
		aStep.setElement(this._element);
		aStep.start();
	}
	
	getCurrentStep() {
		return this._performedSteps[this._currentStepIndex].getCurrentStep();
	}
	
	perfomChangeStep(aStep, aStepName) {
		console.log("wprr/utils/process/ProcessChain::perfomChangeStep");
		console.log(aStep, aStepName);
		
		//METODO: check for abort
		
		let nextIndex = this._currentStepIndex+1;
		if(nextIndex < this._performedSteps.length) {
			this._performedSteps.splice(nextIndex, this._performedSteps.length-nextIndex);
		}
		this._performedSteps.push(aStep);
		this._currentStepIndex = nextIndex;
		this._startStep(aStep);
	}
	
	static create() {
		let newProcessChain = new ProcessChain();
		
		return newProcessChain;
	}
}
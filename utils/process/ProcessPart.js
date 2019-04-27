import Wprr from "wprr/Wprr";
import objectPath from "object-path";

import InputDataHolder from "wprr/utils/InputDataHolder";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import ProcessPart from "wprr/utils/process/ProcessPart";
export default class ProcessPart {
	
	constructor() {
		//METODO
		this._steps = new Object();
		this._owner = null;
		this._element = null;
		
		this.inputs = InputDataHolder.create();
		this._commands = new Object();
		
		this._nextStepName = null;
	}
	
	setOwner(aOwner) {
		this._owner = aOwner;
		
		return this;
	}
	
	setElement(aElement) {
		this._element = aElement;
		
		return this;
	}
	
	setInput(aName, aValue) {
		this.inputs.setInput(aName, aValue);
		
		return this;
	}
	
	setInputWithoutNull(aName, aValue) {
		this.inputs.setInputWithoutNull(aName, aValue);
		
		return this;
	}
	
	getInput(aName) {
		return this.inputs.getInput(aName, objectPath.get(this._element, "props"), this._element);
	}
	
	addCommand(aName, aCommandOrCommands) {
		if(!this._commands[aName]) {
			this._commands[aName] = new Array();
		}
		
		let currentArray = Wprr.utils.array.arrayFromSingleOrMultiple(aCommandOrCommands);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._commands[aName].push(currentArray[i]);
		}
		
		return this;
	}
	
	addStartCommand(aCommandOrCommands) {
		return this.addCommand("start", aCommandOrCommands);
	}
	
	completeDirectlyWhenStarted() {
		return this.addStartCommand(Wprr.commands.callFunction(this, this.done));
	}
	
	_runCommandGroup(aName, aData = null) {
		//console.log("wprr/utils/process/ProcessPart::_runCommandGroup");
		//console.log(aName, aData);
		
		let commands = this._commands[aName];
		if(commands) {
			CommandPerformer.perform(commands, {"process": this, "data": aData}, this._element);
		}
	}
	
	start() {
		//METODO
		this._runCommandGroup("start");
		
		return this;
	}
	
	continue() {
		//console.log("wprr/utils/process/ProcessPart::continue");
		
		this.done();
	}
	
	done() {
		//console.log("wprr/utils/process/ProcessPart::done");
		
		this.nextStep();
	}
	
	getCurrentStep() {
		return this;
	}
	
	nextStep() {
		//console.log("wprr/utils/process/ProcessPart::nextStep");
		
		let nextStep = this.getNextStep();
		return this.step(nextStep);
	}
	
	getNextStep() {
		return this._nextStepName;
	}
	
	step(aStepName) {
		//console.log("wprr/utils/process/ProcessPart::step");
		//console.log(aStepName);
		
		if(this._steps[aStepName]) {
			this._owner.perfomChangeStep(this._steps[aStepName], aStepName);
		}
		else {
			console.error("Step " + aStepName + " doesn't exist", this);
		}
	}
	
	addStep(aName, aStep) {
		this._steps[aName] = aStep;
		
		return this;
	}
	
	setNextStep(aName, aStep) {
		this.addStep(aName, aStep);
		
		this._nextStepName = aName;
		
		return this;
	}
	
	getStep(aName) {
		if(this._steps[aName]) {
			return this._steps[aName];
		}
		
		console.warn("No part named " + aName, this);
		return null;
	}
	
	static create() {
		let newProcessPart = new ProcessPart();
		
		return newProcessPart;
	}
}
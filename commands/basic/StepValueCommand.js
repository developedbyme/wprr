import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import StepValueCommand from "wprr/commands/basic/StepValueCommand";
/**
 * Command that steps a value
 */
export default class StepValueCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
		this.setInput("step", 1);
		this.setInput("stepFunction", StepValueCommand.numbericStep);
		this.setInput("additionalData", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		let step = this.getInput("step");
		let stepFunction = this.getInput("stepFunction");
		let additionalData = this.getInput("additionalData");
		
		let newValue = stepFunction.call(this, value, step, this);
		
		if(element) {
			if(element instanceof Wprr.utils.ValueSourceData) {
				element.value = newValue;
			}
			else if(element.updateValue) {
				element.updateValue(valueName, newValue, additionalData);
			}
			else {
				console.error("Element doesn't have an updateValue function, can't set value " + valueName + " to " + newValue, element, this);
			}
		}
		else {
			console.error("Element is not set, can't set value " + valueName + " to " + newValue, this);
		}
	}
	
	static create(aElement = null, aValueName = null, aValue = null, aStep = null, aStepFunction = null, aAditionalData = null) {
		let newStepValueCommand = new StepValueCommand();
		
		newStepValueCommand.setInputWithoutNull("element", aElement);
		newStepValueCommand.setInputWithoutNull("valueName", aValueName);
		newStepValueCommand.setInputWithoutNull("value", aValue);
		newStepValueCommand.setInputWithoutNull("step", aStep);
		newStepValueCommand.setInputWithoutNull("stepFunction", aStepFunction);
		newStepValueCommand.setInputWithoutNull("additionalData", aAditionalData);
		
		return newStepValueCommand;
	}
	
	static numbericStep(aValue, aStep, aCommand) {
		
		let currentValue = parseFloat(aValue);
		if(isNaN(currentValue)) {
			currentValue = 0;
		}
		
		let returnValue = currentValue+parseFloat(aStep);
		
		let minValue = aCommand.getInput("minValue");
		if(minValue !== null && !isNaN(minValue)) {
			returnValue = Math.max(returnValue, minValue);
		}
		
		let maxValue = aCommand.getInput("maxValue");
		if(maxValue !== null && !isNaN(maxValue)) {
			returnValue = Math.min(returnValue, maxValue);
		}
		
		return returnValue;
	}
}

import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import OptionsStepCommand from "wprr/commands/basic/OptionsStepCommand";
/**
 * Command that steps through a set of values
 */
export default class OptionsStepCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
		this.setInput("step", 1);
		this.setInput("alternateValues", [0, 1, 2]);
		this.setInput("additionalData", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		let step = this.getInput("step");
		let alternateValues = this.getInput("alternateValues");
		
		let isFound = false;
		let selectedValue = null;
		let currentArray = alternateValues;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = currentArray[i];
			if(currentValue === value) {
				isFound = true;
				let nextIndex = Math.max(0, Math.min((i+step), (currentArrayLength-1)));
				selectedValue = currentArray[nextIndex];
			}
		}
		
		if(!isFound) {
			console.warn("Value not recognized " + value + " in " + alternateValues.join(", ") + ". Resetting to first value.");
			selectedValue = alternateValues[0];
		}
		
		let additionalData = this.getInput("additionalData");
		
		element.updateValue(valueName, selectedValue, additionalData);
	}
	
	static create(aElement = null, aValueName = null, aValue = null, aAlternateValues = null, aStep = null, aAditionalData = null) {
		let newOptionsStepCommand = new OptionsStepCommand();
		
		newOptionsStepCommand.setInputWithoutNull("element", aElement);
		newOptionsStepCommand.setInputWithoutNull("valueName", aValueName);
		newOptionsStepCommand.setInputWithoutNull("value", aValue);
		newOptionsStepCommand.setInputWithoutNull("alternateValues", aAlternateValues);
		newOptionsStepCommand.setInputWithoutNull("step", aStep);
		newOptionsStepCommand.setInputWithoutNull("additionalData", aAditionalData);
		
		return newOptionsStepCommand;
	}
}

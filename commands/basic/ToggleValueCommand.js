import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import ToggleValueCommand from "wprr/commands/basic/ToggleValueCommand";
/**
 * Command that toggles a value
 */
export default class ToggleValueCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
		this.setInput("alternateValues", [true, false]);
		this.setInput("additionalData", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		let alternateValues = this.getInput("alternateValues");
		
		let isFound = false;
		let selectedValue = null;
		let currentArray = alternateValues;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentValue = currentArray[i];
			if(currentValue === value) {
				isFound = true;
				selectedValue = currentArray[(i+1)%currentArrayLength];
			}
		}
		
		if(!isFound) {
			console.warn("Value not recognized " + value + " in " + alternateValues.join(", ") + ". Resetting to first value.");
			selectedValue = alternateValues[0];
		}
		
		let additionalData = this.getInput("additionalData");
		
		element.updateValue(valueName, selectedValue, additionalData);
	}
	
	static create(aElement = null, aValueName = null, aValue = null, aAlternateValues = null, aAditionalData = null) {
		let newToggleValueCommand = new ToggleValueCommand();
		
		newToggleValueCommand.setInputWithoutNull("element", aElement);
		newToggleValueCommand.setInputWithoutNull("valueName", aValueName);
		newToggleValueCommand.setInputWithoutNull("value", aValue);
		newToggleValueCommand.setInputWithoutNull("alternateValues", aAlternateValues);
		newToggleValueCommand.setInputWithoutNull("additionalData", aAditionalData);
		
		return newToggleValueCommand;
	}
}

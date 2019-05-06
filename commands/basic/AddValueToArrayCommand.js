import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import AddValueToArrayCommand from "wprr/commands/basic/AddValueToArrayCommand";
/**
 * Command that adds a value to array
 */
export default class AddValueToArrayCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		
		if(element) {
			if(element.addValueToArray) {
				element.addValueToArray(valueName, value);
			}
			else {
				console.error("Element doesn't have an updateValue function, can't set value " + valueName + " to " + value, element, this);
			}
		}
		else {
			console.error("Element is not set, can't set value " + valueName + " to " + value, this);
		}
	}
	
	static create(aElement = null, aValueName = null, aValue = null) {
		let newAddValueToArrayCommand = new AddValueToArrayCommand();
		
		newAddValueToArrayCommand.setInputWithoutNull("element", aElement);
		newAddValueToArrayCommand.setInputWithoutNull("valueName", aValueName);
		newAddValueToArrayCommand.setInputWithoutNull("value", aValue);
		
		return newAddValueToArrayCommand;
	}
}

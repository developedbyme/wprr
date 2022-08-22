import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import SetValueCommand from "wprr/commands/basic/SetValueCommand";
/**
 * Command that sets a value
 */
export default class SetValueCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
		this.setInput("additionalData", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		let additionalData = this.getInput("additionalData");
		
		if(element) {
			if(element instanceof Wprr.utils.ValueSourceData) {
				element.value = value;
			}
			else if(element.updateValue) {
				element.updateValue(valueName, value, additionalData);
			}
			else {
				console.error("Element doesn't have an updateValue function, can't set value " + valueName + " to " + value, element, this);
			}
		}
		else {
			console.error("Element is not set, can't set value " + valueName + " to " + value, this);
		}
	}
	
	static create(aElement = null, aValueName = null, aValue = null, aAditionalData = null) {
		let newSetValueCommand = new SetValueCommand();
		
		newSetValueCommand.setInputWithoutNull("element", aElement);
		newSetValueCommand.setInputWithoutNull("valueName", aValueName);
		newSetValueCommand.setInputWithoutNull("value", aValue);
		newSetValueCommand.setInputWithoutNull("additionalData", aAditionalData);
		
		return newSetValueCommand;
	}
}

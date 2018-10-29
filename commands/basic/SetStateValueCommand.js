import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import SetStateValueCommand from "wprr/commands/basic/SetStateValueCommand";
/**
 * Command that sets a state value
 */
export default class SetStateValueCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
		this.setInput("forceSet", false);
		
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		let forceSet = this.getInput("forceSet");
		
		if(element) {
			if(element.setState) {
				if(forceSet || value != element.state[valueName]) {
					let newState = new Object();
					newState[valueName] = value;
				
					element.setState(newState);
				}
			}
			else {
				console.error("Element doesn't have an setState function, can't set state " + valueName + " to " + value, element, this);
			}
		}
		else {
			console.error("Element is not set, can't set state " + valueName + " to " + value, this);
		}
	}
	
	static create(aElement = null, aValueName = null, aValue = null, aForceSet = null) {
		let newSetStateValueCommand = new SetStateValueCommand();
		
		newSetStateValueCommand.setInputWithoutNull("element", aElement);
		newSetStateValueCommand.setInputWithoutNull("valueName", aValueName);
		newSetStateValueCommand.setInputWithoutNull("value", aValue);
		newSetStateValueCommand.setInputWithoutNull("forceSet", aForceSet);
		
		return newSetStateValueCommand;
	}
}

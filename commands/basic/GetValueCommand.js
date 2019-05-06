import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import GetValueCommand from "wprr/commands/basic/GetValueCommand";
/**
 * Command that gets a value
 */
export default class GetValueCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
		this.setInput("valueName", null);
	}
	
	perform() {
		
		let element = this.getInput("element");
		let valueName = this.getInput("valueName");
		
		if(element) {
			if(element.getValue) {
				return element.getValue(valueName);
			}
			else {
				console.error("Element doesn't have an getValue function, can't get value " + valueName, element, this);
			}
		}
		else {
			console.error("Element is not set, can't get value " + valueName, this);
		}
		
		return null;
	}
	
	static create(aElement = null, aValueName = null) {
		let newGetValueCommand = new GetValueCommand();
		
		newGetValueCommand.setInputWithoutNull("element", aElement);
		newGetValueCommand.setInputWithoutNull("valueName", aValueName);
		
		return newGetValueCommand;
	}
}

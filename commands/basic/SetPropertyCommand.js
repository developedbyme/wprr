import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import SetPropertyCommand from "wprr/commands/basic/SetPropertyCommand";
/**
 * Command that sets a property
 */
export default class SetPropertyCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("object", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
	}
	
	perform() {
		
		let object = this.getInput("object");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		
		if(object) {
			object[valueName] = value;
		}
		else {
			console.error("Object is not set, can't set value " + valueName + " to " + value, this);
		}
	}
	
	static create(aObject = null, aValueName = null, aValue = null) {
		let newSetPropertyCommand = new SetPropertyCommand();
		
		newSetPropertyCommand.setInputWithoutNull("object", aObject);
		newSetPropertyCommand.setInputWithoutNull("valueName", aValueName);
		newSetPropertyCommand.setInputWithoutNull("value", aValue);
		
		return newSetPropertyCommand;
	}
}

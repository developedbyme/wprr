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
		
		this.setInput("dataStorage", null);
		this.setInput("valueName", null);
		this.setInput("value", null);
	}
	
	perform() {
		
		let dataStorage = this.getInput("dataStorage");
		let valueName = this.getInput("valueName");
		let value = this.getInput("value");
		
		if(dataStorage) {
			if(dataStorage.addValueToArray) {
				dataStorage.addValueToArray(valueName, value);
			}
			else {
				console.error("Data storage doesn't have an addValueToArray function, can't set value " + valueName + " to " + value, dataStorage, this);
			}
		}
		else {
			console.error("Data storage is not set, can't set value " + valueName + " to " + value, this);
		}
	}
	
	static create(aDataStorage = null, aValueName = null, aValue = null) {
		let newAddValueToArrayCommand = new AddValueToArrayCommand();
		
		newAddValueToArrayCommand.setInputWithoutNull("dataStorage", aDataStorage);
		newAddValueToArrayCommand.setInputWithoutNull("valueName", aValueName);
		newAddValueToArrayCommand.setInputWithoutNull("value", aValue);
		
		return newAddValueToArrayCommand;
	}
}

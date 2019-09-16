import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import RemoveValueFromArrayCommand from "wprr/commands/basic/RemoveValueFromArrayCommand";
/**
 * Command that remves a value to array
 */
export default class RemoveValueFromArrayCommand extends BaseCommand {
	
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
			if(dataStorage.removeValueFromArray) {
				dataStorage.removeValueFromArray(valueName, value);
			}
			else {
				console.error("Data storage doesn't have an removeValueFromArray function, can't set value " + valueName + " to " + value, dataStorage, this);
			}
		}
		else {
			console.error("Data storage is not set, can't set value " + valueName + " to " + value, this);
		}
	}
	
	static create(aDataStorage = null, aValueName = null, aValue = null) {
		let newRemoveValueFromArrayCommand = new RemoveValueFromArrayCommand();
		
		newRemoveValueFromArrayCommand.setInputWithoutNull("dataStorage", aDataStorage);
		newRemoveValueFromArrayCommand.setInputWithoutNull("valueName", aValueName);
		newRemoveValueFromArrayCommand.setInputWithoutNull("value", aValue);
		
		return newRemoveValueFromArrayCommand;
	}
}

import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

//import RemoveIndexFromArrayCommand from "wprr/commands/basic/RemoveIndexFromArrayCommand";
/**
 * Command that removes an index from array
 */
export default class RemoveIndexFromArrayCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("dataStorage", null);
		this.setInput("valueName", null);
		this.setInput("index", null);
	}
	
	perform() {
		
		let dataStorage = this.getInput("dataStorage");
		let valueName = this.getInput("valueName");
		let index = this.getInput("index");
		
		if(dataStorage) {
			let currentValue = [].concat(dataStorage.getValue(valueName));
			currentValue.splice(index, 1);
			dataStorage.updateValue(valueName, currentValue)
		}
		else {
			console.error("Data storage is not set, can't set value " + valueName + " to " + value, this);
		}
	}
	
	static create(aDataStorage = null, aValueName = null, aIndex = null) {
		let newRemoveIndexFromArrayCommand = new RemoveIndexFromArrayCommand();
		
		newRemoveIndexFromArrayCommand.setInputWithoutNull("dataStorage", aDataStorage);
		newRemoveIndexFromArrayCommand.setInputWithoutNull("valueName", aValueName);
		newRemoveIndexFromArrayCommand.setInputWithoutNull("index", aIndex);
		
		return newRemoveIndexFromArrayCommand;
	}
}

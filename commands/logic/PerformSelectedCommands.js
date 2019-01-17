import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import PerformSelectedCommands from "wprr/commands/logic/PerformSelectedCommands";
/**
 * Command that performs a set of commands based on a selection.
 */
export default class PerformSelectedCommands extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("selected", null);
		this.setInput("options", new Array());
	}
	
	perform() {
		
		let selected = this.getInput("selected");
		let options = this.getInput("options");
		
		let isFound = false;
		
		let currentArray = options;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOption = currentArray[i];
			if(currentOption.key === selected) {
				
				CommandPerformer.perform(currentOption.value, this._eventData, this._triggerElement);
				isFound = true;
				break;
			}
		}
		
		if(!isFound) {
			console.log("No commands for key " + selected, this);
		}
	}
	
	addOption(aKey, aCommands) {
		this.getRawInput("options").push({"key": aKey, "value": aCommands});
		
		return this;
	}
	
	static create(aSelected = null, aOptions = null) {
		let newPerformSelectedCommands = new PerformSelectedCommands();
		
		newPerformSelectedCommands.setInputWithoutNull("selected", aSelected);
		newPerformSelectedCommands.setInputWithoutNull("options", aOptions);
		
		return newPerformSelectedCommands;
	}
}

import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import ConfirmCommand from "wprr/commands/browser/ConfirmCommand";
/**
 * Command that performs a set of commands based on a confirmation.
 */
export default class ConfirmCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("question", "Are you sure?");
		this.setInput("confirmedCommands", new Array());
		this.setInput("deniedCommands", new Array());
	}
	
	perform() {
		
		let question = this.getInput("question");
		
		if(confirm(question)) {
			let commands = this.getInput("confirmedCommands");
			CommandPerformer.perform(commands, this._eventData, this._triggerElement);
			return true;
		}
		else {
			let commands = this.getInput("deniedCommands");
			CommandPerformer.perform(commands, this._eventData, this._triggerElement);
			return false;
		}
	}
	
	static create(aQuestion = null, aConfirmedCommands = null, aDeniedCommands = null) {
		let newConfirmCommand = new ConfirmCommand();
		
		newConfirmCommand.setInputWithoutNull("question", aQuestion);
		newConfirmCommand.setInputWithoutNull("confirmedCommands", aConfirmedCommands);
		newConfirmCommand.setInputWithoutNull("deniedCommands", aDeniedCommands);
		
		return newConfirmCommand;
	}
}

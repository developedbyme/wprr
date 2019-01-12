import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import DelayCommand from "wprr/commands/animation/DelayCommand";
/**
 * Command that delays other commands
 */
export default class DelayCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("commands", []);
		this.setInput("time", 0);
	}
	
	perform() {
		
		let commands = this.getInput("commands");
		let time = 1000*this.getInput("time");
		
		let triggerElement = this._triggerElement;
		let eventData = this._eventData;
		
		//MENOTE: usually i wouldn't create new functions, but the data can change or be triggered multiple times during the delay, and i really don't want to create a new class for delays (at the moment)
		setTimeout(function() {
			CommandPerformer.perform(commands, eventData, triggerElement);
		}, time);
	}
	
	static create(aCommands = null, aTime = null) {
		let newDelayCommand = new DelayCommand();
		
		newDelayCommand.setInputWithoutNull("commands", aCommands);
		newDelayCommand.setInputWithoutNull("time", aTime);
		
		return newDelayCommand;
	}
}

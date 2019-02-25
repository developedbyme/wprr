import BaseCommand from "wprr/commands/BaseCommand";

import SourceData from "wprr/reference/SourceData";

//import StopPropagationCommand from "wprr/commands/browser/StopPropagationCommand";
/**
 * Command that stops the propagation of an event.
 */
export default class StopPropagationCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("event", SourceData.create("event", "raw"));
	}
	
	perform() {
		
		let theEvent = this.getInput("event");
		
		theEvent.preventDefault();
	}
	
	static create(aEvent = null) {
		let newStopPropagationCommand = new StopPropagationCommand();
		
		newStopPropagationCommand.setInputWithoutNull("event", aEvent);
		
		return newStopPropagationCommand;
	}
}

import BaseCommand from "wprr/commands/BaseCommand";

import SourceData from "wprr/reference/SourceData";

//import PreventDefaultCommand from "wprr/commands/browser/PreventDefaultCommand";
/**
 * Command that prevents the default action of an event.
 */
export default class PreventDefaultCommand extends BaseCommand {
	
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
		let newPreventDefaultCommand = new PreventDefaultCommand();
		
		newPreventDefaultCommand.setInputWithoutNull("event", aEvent);
		
		return newPreventDefaultCommand;
	}
}

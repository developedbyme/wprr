import BaseCommand from "wprr/commands/BaseCommand";

//import AlertCommand from "wprr/commands/browser/AlertCommand";
/**
 * Command that shows an alert
 */
export default class AlertCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("message", "[Alert message no set]");
	}
	
	perform() {
		
		let message = this.getInput("message");
		
		alert(message);
	}
	
	static create(aMessage = null) {
		let newAlertCommand = new AlertCommand();
		
		newAlertCommand.setInputWithoutNull("message", aMessage);
		
		return newAlertCommand;
	}
}

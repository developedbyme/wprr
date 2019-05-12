import BaseCommand from "wprr/commands/BaseCommand";

//import ConsoleLogCommand from "wprr/commands/debug/ConsoleLogCommand";
/**
 * Command that logs a value to the console
 */
export default class ConsoleLogCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("message", "[Alert message no set]");
	}
	
	perform() {
		
		let message = this.getInput("message");
		
		console.log(message);
	}
	
	static create(aMessage = null) {
		let newConsoleLogCommand = new ConsoleLogCommand();
		
		newConsoleLogCommand.setInputWithoutNull("message", aMessage);
		
		return newConsoleLogCommand;
	}
}

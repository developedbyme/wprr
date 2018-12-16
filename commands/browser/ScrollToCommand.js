import BaseCommand from "wprr/commands/BaseCommand";

//import ScrollToCommand from "wprr/commands/browser/ScrollToCommand";
/**
 * Command that scrolls the browser
 */
export default class ScrollToCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("x", 0);
		this.setInput("y", 0);
	}
	
	perform() {
		
		let x = this.getInput("x");
		let y = this.getInput("y");
		
		window.scrollTo(x, y);
	}
	
	static create(aX = null, aY = null) {
		let newScrollToCommand = new ScrollToCommand();
		
		newScrollToCommand.setInputWithoutNull("x", aX);
		newScrollToCommand.setInputWithoutNull("y", aY);
		
		return newScrollToCommand;
	}
}

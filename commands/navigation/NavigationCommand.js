import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import NavigationCommand from "wprr/commands/navigation/NavigationCommand";
/**
 * Command that navigates the browser
 */
export default class NavigationCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("url", null);
	}
	
	perform() {
		wprr.navigate(this.getInput("url"));
	}
	
	static create(aUrl = null) {
		let newNavigationCommand = new NavigationCommand();
		
		newNavigationCommand.setInputWithoutNull("url", aUrl);
		
		return newNavigationCommand;
	}
}

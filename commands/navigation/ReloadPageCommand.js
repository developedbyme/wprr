import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import ReloadPageCommand from "wprr/commands/navigation/ReloadPageCommand";
/**
 * Command that reloads the page
 */
export default class ReloadPageCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
	}
	
	perform() {
		document.location.reload();
	}
	
	static create() {
		let newReloadPageCommand = new ReloadPageCommand();
		
		return newReloadPageCommand;
	}
}

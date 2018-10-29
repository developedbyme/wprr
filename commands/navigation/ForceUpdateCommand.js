import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import ForceUpdateCommand from "wprr/commands/navigation/ForceUpdateCommand";
/**
 * Command that forces the virtual dom to update
 */
export default class ForceUpdateCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", null);
	}
	
	perform() {
		this.getInput("element").forceUpdate();
	}
	
	static create(aElement = null) {
		let newForceUpdateCommand = new ForceUpdateCommand();
		
		newForceUpdateCommand.setInputWithoutNull("element", aElement);
		
		return newForceUpdateCommand;
	}
}

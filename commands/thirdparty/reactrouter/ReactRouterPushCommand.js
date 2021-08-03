import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

//import ReactRouterPushCommand from "wprr/commands/thirdparty/reactrouter/ReactRouterPushCommand";
/**
 * Command that sends a push to the react router
 */
export default class ReactRouterPushCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("to", null);
		this.setInput("history", SourceDataWithPath.create("reference", "context/react-router", "history"));
	}
	
	perform() {
		
		let to = this.getInput("to");
		
		let historyController = this.getInput("history");
		if(!historyController) {
			console.error("Command doesn't have any history controller, can't push state.", to, this);
			return;
		}
		
		console.log(historyController);
		historyController.push(to);
	}
	
	static create(aTo = null, aHistory = null) {
		let newReactRouterPushCommand = new ReactRouterPushCommand();
		
		newReactRouterPushCommand.setInputWithoutNull("to", aTo);
		newReactRouterPushCommand.setInputWithoutNull("history", aHistory);
		
		return newReactRouterPushCommand;
	}
}

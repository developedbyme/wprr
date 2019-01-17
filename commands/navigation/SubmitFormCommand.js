import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import SubmitFormCommand from "wprr/commands/navigation/SubmitFormCommand";
/**
 * Command that submits a form
 */
export default class SubmitFormCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", SourceData.create("reference", "trigger/form/submit"));
	}
	
	perform() {
		this.getInput("element").submit();
	}
	
	static create(aElement = null) {
		let newSubmitFormCommand = new SubmitFormCommand();
		
		newSubmitFormCommand.setInputWithoutNull("element", aElement);
		
		return newSubmitFormCommand;
	}
}

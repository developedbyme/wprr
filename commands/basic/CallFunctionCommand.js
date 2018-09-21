import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";
/**
 * Command that calls a function
 */
export default class CallFunctionCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("thisObject", null);
		this.setInput("theFunction", null);
		this.setInput("theArguments", []);
	}
	
	perform() {
		//METODO: should be overridden
		
		let thisObject = this.getInput("thisObject");
		let theFunction = this.getInput("theFunction");
		let theArguments = this.getInput("theArguments");
		
		let currentArray = theArguments;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			currentArray[i] = this.resolveSource(currentArray[i]);
		}
		
		let returnValue = theFunction.apply(thisObject, theArguments);
		
		return returnValue;
	}
	
	static create(aThisObject = null, aFunction = null, aArguments = null) {
		let newCallFunctionCommand = new CallFunctionCommand();
		
		newCallFunctionCommand.setInputWithoutNull("thisObject", aThisObject);
		newCallFunctionCommand.setInputWithoutNull("theFunction", aFunction);
		newCallFunctionCommand.setInputWithoutNull("theArguments", aArguments);
		
		return newCallFunctionCommand;
	}
}

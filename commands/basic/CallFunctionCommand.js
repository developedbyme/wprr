import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

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
		
		let thisObject = this.getInput("thisObject");
		let theFunction = this.getInput("theFunction");
		let theArguments = this.getInput("theArguments");
		
		if(!Array.isArray(theArguments)) {
			console.warn("Arguments are not an array. Assuming value as first argument.", theArguments, this);
			theArguments = [theArguments];
		}
		
		let resolvedArguments = [].concat(theArguments);
		
		let currentArray = resolvedArguments;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			currentArray[i] = this.resolveSource(currentArray[i]);
		}
		
		if(theFunction instanceof Function) {
			let returnValue = theFunction.apply(thisObject, resolvedArguments);
			return returnValue;
		}
		
		console.error(theFunction + " is not a function. Can't call.", thisObject, resolvedArguments, this);
	}
	
	static create(aThisObject = null, aFunction = null, aArguments = null) {
		let newCallFunctionCommand = new CallFunctionCommand();
		
		newCallFunctionCommand.setInputWithoutNull("thisObject", aThisObject);
		newCallFunctionCommand.setInputWithoutNull("theFunction", aFunction);
		newCallFunctionCommand.setInputWithoutNull("theArguments", aArguments);
		
		return newCallFunctionCommand;
	}
	
	static createWithFunctionName(aThisObject, aFunctionName, aArguments = null) {
		let newCallFunctionCommand = new CallFunctionCommand();
		
		newCallFunctionCommand.setInputWithoutNull("thisObject", aThisObject);
		newCallFunctionCommand.setInputWithoutNull("theFunction", SourceDataWithPath.create("staticSource", aThisObject, aFunctionName));
		newCallFunctionCommand.setInputWithoutNull("theArguments", aArguments);
		
		return newCallFunctionCommand;
	}
}

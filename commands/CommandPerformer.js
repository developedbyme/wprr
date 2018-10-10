import SourceData from "wprr/reference/SourceData";

//import CommandPerformer from "wprr/commands/CommandPerformer";
/**
 * Object that performs a set of commands
 */
export default class CommandPerformer {
	
	static perform(aCommandOrCommands, aData, aTriggerElement) {
		let currentArray;
		if(Array.isArray(aCommandOrCommands)) {
			currentArray = aCommandOrCommands;
		}
		else {
			currentArray = [aCommandOrCommands];
		}
		
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			//METODO: resolve command
			let currentCommand = currentArray[i];
			
			currentCommand.setTriggerElement(aTriggerElement);
			currentCommand.setEventData(aData);
			
			currentCommand.perform();
		}
	}
}

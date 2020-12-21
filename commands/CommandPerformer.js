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
			
			CommandPerformer.safePerformCommand(currentCommand, aData, aTriggerElement);
		}
	}
	
	static performCommand(aCommand, aData, aTriggerElement) {
		if(CommandPerformer.CATCH_ERRORS) {
			return CommandPerformer.safePerformCommand(aCommand, aData, aTriggerElement);
		}
		else {
			return CommandPerformer.unsafePerformCommand(aCommand, aData, aTriggerElement);
		}
	}
	
	static safePerformCommand(aCommand, aData, aTriggerElement) {
		try {
			return CommandPerformer.unsafePerformCommand(aCommand, aData, aTriggerElement);
		}
		catch(theError) {
			console.error("Command had an error.", aCommand, aData, aTriggerElement);
			console.error(theError);
		}
	}
	
	static unsafePerformCommand(aCommand, aData, aTriggerElement) {
		aCommand.setTriggerElement(aTriggerElement);
		aCommand.setEventData(aData);
		
		return aCommand.perform();
	}
}

CommandPerformer.CATCH_ERRORS = true;

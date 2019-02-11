import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import FilterArrayWithCommand from "wprr/manipulation/adjustfunctions/logic/FilterArrayWithCommand";
/**
 * Adjust function that filters an array
 */
export default class FilterArrayWithCommand extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("command", SourceData.create("prop", "command"));
		this.setInput("outputName", "output");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["input"];
		delete aProps["command"];
	}
	
	/**
	 * Filters the array
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/FilterArrayWithCommand::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let command = this.getInput("command", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		let currentArray = input;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			command.setTriggerElement(aManipulationObject);
			command.setEventData({"item": currentItem, "props": aData});
			
			if(command.perform()) {
				returnArray.push(currentItem);
			}
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array		The data to group.
	 * @param	aCommand		SourceData|BaseCommand	The command to filters the values
	 * @param	aOutputName		SourceData|String		The output name to stroe the data in
	 *
	 * @return	FilterArrayWithCommand	The new instance.
	 */
	static create(aInput = null, aCommand = null, aOutputName = null) {
		let newFilterArrayWithCommand = new FilterArrayWithCommand();
		
		newFilterArrayWithCommand.setInputWithoutNull("input", aInput);
		newFilterArrayWithCommand.setInputWithoutNull("command", aCommand);
		newFilterArrayWithCommand.setInputWithoutNull("outputName", aOutputName);
		
		return newFilterArrayWithCommand;
	}
}

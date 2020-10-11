import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import SwitchValue from "wprr/manipulation/adjustfunctions/logic/SwitchValue";
/**
 * Adjust function that switches a value.
 */
export default class SwitchValue extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("options", SourceData.create("prop", "options"));
		this.setInput("defaultKey", null);
		this.setInput("defaultValue", null);
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
		delete aProps["options"];
	}
	
	/**
	 * Switches the value
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/SwitchValue::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let options = this.getInput("options", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		let defaultKey = this.getInput("defaultKey", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let defaultOption = null;
		let returnValue = null;
		
		let currentArray = options;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOption = currentArray[i];
			if(currentOption.key === input) {
				returnValue = currentOption.value;
			}
			if(currentOption.key === defaultKey) {
				defaultOption = currentOption.value;
			}
		}
		
		if(!returnValue && defaultOption) {
			returnValue = defaultOption;
		}
		
		if(!returnValue) {
			returnValue = this.getInput("defaultValue", aData, aManipulationObject);
		}
		
		aData[outputName] = returnValue;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array	The data to group.
	 * @param	aOptions		SourceData|Function	The options to switch between
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	SwitchValue	The new instance.
	 */
	static create(aInput = null, aOptions = null, aOutputName = null) {
		let newSwitchValue = new SwitchValue();
		
		newSwitchValue.setInputWithoutNull("input", aInput);
		newSwitchValue.setInputWithoutNull("options", aOptions);
		newSwitchValue.setInputWithoutNull("outputName", aOutputName);
		
		return newSwitchValue;
	}
}

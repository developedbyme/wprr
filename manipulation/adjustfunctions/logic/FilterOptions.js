import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import FilterOptions from "wprr/manipulation/adjustfunctions/logic/FilterOptions";
/**
 * Adjust function that filters options to only have seleted keys
 */
export default class FilterOptions extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "options"));
		this.setInput("keys", SourceData.create("prop", "keys"));
		this.setInput("outputName", "options");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["options"];
		delete aProps["keys"];
	}
	
	/**
	 * Filters options to only have seleted keys
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/FilterOptions::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let keys = this.getInput("keys", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		let currentArray = input;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOption = currentArray[i];
			if(keys.indexOf(currentOption.value) !== -1) {
				returnArray.push(currentOption);
			}
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array	The data to group.
	 * @param	aKeys			SourceData|Array	The keys to filter on
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	FilterOptions	The new instance.
	 */
	static create(aInput = null, aKeys = null, aOutputName = null) {
		let newFilterOptions = new FilterOptions();
		
		newFilterOptions.setInputWithoutNull("input", aInput);
		newFilterOptions.setInputWithoutNull("keys", aKeys);
		newFilterOptions.setInputWithoutNull("outputName", aOutputName);
		
		return newFilterOptions;
	}
}

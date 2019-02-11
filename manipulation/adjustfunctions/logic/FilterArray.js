import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import FilterArray from "wprr/manipulation/adjustfunctions/logic/FilterArray";
/**
 * Adjust function that filters an array
 */
export default class FilterArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("filterFunction", SourceData.create("prop", "filterFunction"));
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
		delete aProps["filterFunction"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/FilterArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let filterFunction = this.getInput("filterFunction", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = input.filter(filterFunction);
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array	The data to group.
	 * @param	aFilterFunction	SourceData|Function	The function to filters the values
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	FilterArray	The new instance.
	 */
	static create(aInput = null, aFilterFunction = null, aOutputName = null) {
		let newFilterArray = new FilterArray();
		
		newFilterArray.setInputWithoutNull("input", aInput);
		newFilterArray.setInputWithoutNull("filterFunction", aFilterFunction);
		newFilterArray.setInputWithoutNull("outputName", aOutputName);
		
		return newFilterArray;
	}
}

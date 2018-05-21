import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import SortArray from "wprr/manipulation/adjustfunctions/logic/SortArray";
/**
 * Adjust function that sorts an array
 */
export default class SortArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("sortFunction", SourceData.create("prop", "sort"));
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
		delete aProps["sortFunction"];
	}
	
	/**
	 * Sorts the array
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/SortArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let sortFunction = this.getInput("sortFunction", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = [].concat(input);
		returnArray.sort(sortFunction);
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array	The data to group.
	 * @param	aSortFunction	SourceData|Function	The function to sort the values
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	SortArray	The new instance.
	 */
	static create(aInput = null, aSortFunction = null, aOutputName = null) {
		let newSortArray = new SortArray();
		
		newSortArray.setInputWithoutNull("input", aInput);
		newSortArray.setInputWithoutNull("sortFunction", aSortFunction);
		newSortArray.setInputWithoutNull("outputName", aOutputName);
		
		return newSortArray;
	}
}

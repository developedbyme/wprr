import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import ApplyFilterChain from "wprr/manipulation/adjustfunctions/logic/ApplyFilterChain";
/**
 * Adjust function that filters an array with a filter chain.
 */
export default class ApplyFilterChain extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("filterChain", SourceData.create("prop", "filterChain"));
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
		delete aProps["filterChain"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/ApplyFilterChain::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let filterChain = this.getInput("filterChain", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = filterChain.filter(input, aManipulationObject, aData);
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array		The data to group.
	 * @param	aFilterChain	SourceData|FilterChain	The chain that filters the values
	 * @param	aOutputName		SourceData|String		The output name to stroe the data in
	 *
	 * @return	ApplyFilterChain	The new instance.
	 */
	static create(aInput = null, aFilterChain = null, aOutputName = null) {
		let newApplyFilterChain = new ApplyFilterChain();
		
		newApplyFilterChain.setInputWithoutNull("input", aInput);
		newApplyFilterChain.setInputWithoutNull("filterChain", aFilterChain);
		newApplyFilterChain.setInputWithoutNull("outputName", aOutputName);
		
		return newApplyFilterChain;
	}
}

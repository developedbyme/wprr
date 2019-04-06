import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import ApplySortChain from "wprr/manipulation/adjustfunctions/logic/ApplySortChain";
/**
 * Adjust function that sorts an array with a sort chain.
 */
export default class ApplySortChain extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("sortChain", SourceData.create("prop", "sortChain"));
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
		delete aProps["sortChain"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/ApplySortChain::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let sortChain = this.getInput("sortChain", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = sortChain.sort([].concat(input), aManipulationObject, aData);
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array		The data to group.
	 * @param	aFilterChain	SourceData|SortChain	The chain that sorts the values
	 * @param	aOutputName		SourceData|String		The output name to stroe the data in
	 *
	 * @return	ApplySortChain	The new instance.
	 */
	static create(aInput = null, aFilterChain = null, aOutputName = null) {
		let newApplySortChain = new ApplySortChain();
		
		newApplySortChain.setInputWithoutNull("input", aInput);
		newApplySortChain.setInputWithoutNull("sortChain", aFilterChain);
		newApplySortChain.setInputWithoutNull("outputName", aOutputName);
		
		return newApplySortChain;
	}
}

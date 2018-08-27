import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import JoinArray from "wprr/manipulation/adjustfunctions/text/JoinArray";
/**
 * Adjust function that joins an array
 */
export default class JoinArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", ["Input not set"]);
		this.setInput("separator", "");
		this.setInput("outputName", "output");
	}
	
	/**
	 * Joins the array.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/text/JoinArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		let separator = this.getInput("separator", aData, aManipulationObject);
		
		aData[outputName] = input.join(separator);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput					Array | SourceData		The array to join.
	 * @param	aSeparator				String | SourceData		The separator to use when joining.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	JoinArray	The new instance.
	 */
	static create(aInput = null, aSeparator = null, aOutputName = null) {
		let newJoinArray = new JoinArray();
		
		newJoinArray.setInputWithoutNull("input", aInput);
		newJoinArray.setInputWithoutNull("separator", aSeparator);
		newJoinArray.setInputWithoutNull("outputName", aOutputName);
		
		return newJoinArray;
	}
}

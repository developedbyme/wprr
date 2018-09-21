import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import AddToArray from "wprr/manipulation/adjustfunctions/logic/AddToArray";
/**
 * Adjust function that adds values to an array
 */
export default class AddToArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("values", SourceData.create("prop", "values"));
		this.setInput("fromFront", false);
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
		delete aProps["values"];
	}
	
	/**
	 * Adds values to the array
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/AddToArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let values = this.getInput("values", aData, aManipulationObject);
		let fromFront = this.getInput("fromFront", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray;
		if(fromFront) {
			returnArray = [].concat(values, input);
		}
		else {
			returnArray = [].concat(input, values);
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Array	The data to group.
	 * @param	aValues			SourceData|Array|*	The values to add to the array
	 * @param	aFromFront		SourceData|Boolean	If values should be added at the from of the array.
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	AddToArray	The new instance.
	 */
	static create(aInput = null, aValues = null, aFromFront = null, aOutputName = null) {
		let newAddToArray = new AddToArray();
		
		newAddToArray.setInputWithoutNull("input", aInput);
		newAddToArray.setInputWithoutNull("values", aValues);
		newAddToArray.setInputWithoutNull("fromFront", aFromFront);
		newAddToArray.setInputWithoutNull("outputName", aOutputName);
		
		return newAddToArray;
	}
}

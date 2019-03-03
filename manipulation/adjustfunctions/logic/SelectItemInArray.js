import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import ArrayFunctions from "wprr/utils/ArrayFunctions";

//import SelectItemInArray from "wprr/manipulation/adjustfunctions/logic/SelectItemInArray";
/**
 * Adjust function that selects an item in an array
 */
export default class SelectItemInArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("array", SourceData.create("prop", "input"));
		this.setInput("item", SourceData.create("prop", "item"));
		this.setInput("field", "id");
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
		delete aProps["item"];
	}
	
	/**
	 * Selects the the item
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/SelectItemInArray::adjust");
		
		let range = this.getInput("array", aData, aManipulationObject);
		let item = this.getInput("item", aData, aManipulationObject);
		let field = this.getInput("field", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		aData[outputName] = ArrayFunctions.getItemBy(field, item, range);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aArray		Array | SourceData	The range to select from
	 * @param	aItem		* | SourceData		The item to select
	 * @param	aField		String | SourceData	The field to select the item by
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	SelectItemInArray	The new instance.
	 */
	static create(aArray = null, aItem = null, aField = null, aOutputName = null) {
		let newSelectItemInArray = new SelectItemInArray();
		
		newSelectItemInArray.setInputWithoutNull("array", aArray);
		newSelectItemInArray.setInputWithoutNull("item", aItem);
		newSelectItemInArray.setInputWithoutNull("field", aField);
		newSelectItemInArray.setInputWithoutNull("outputName", aOutputName);
		
		return newSelectItemInArray;
	}
}

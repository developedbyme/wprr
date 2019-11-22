import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import ArrayFunctions from "wprr/utils/ArrayFunctions";

//import SelectItemsInArray from "wprr/manipulation/adjustfunctions/logic/SelectItemsInArray";
/**
 * Adjust function that selects a items in an array
 */
export default class SelectItemsInArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("array", SourceData.create("prop", "input"));
		this.setInput("items", SourceData.create("prop", "items"));
		this.setInput("field", "id");
		this.setInput("outputField", null);
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
		delete aProps["items"];
	}
	
	/**
	 * Selects the items
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/SelectItemsInArray::adjust");
		
		let range = this.getInput("array", aData, aManipulationObject);
		let items = ArrayFunctions.arrayOrSeparatedString(this.getInput("items", aData, aManipulationObject));
		let field = this.getInput("field", aData, aManipulationObject);
		let outputField = this.getInput("outputField", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		let currentArray = items;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentData = ArrayFunctions.getItemBy(field, currentItem, range);
			returnArray.push(currentData);
		}
		
		aData[outputName] = returnArray;
		
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aArray		Array | SourceData				The range to select from
	 * @param	aItems		Array | String | SourceData		The items to select
	 * @param	aField		String | SourceData				The field to select the item by
	 * @param	aOutputName	String							The name of the prop to set the data to.
	 *
	 * @return	SelectItemsInArray	The new instance.
	 */
	static create(aArray = null, aItems = null, aField = null, aOutputName = null) {
		let newSelectItemsInArray = new SelectItemsInArray();
		
		newSelectItemsInArray.setInputWithoutNull("array", aArray);
		newSelectItemsInArray.setInputWithoutNull("items", aItems);
		newSelectItemsInArray.setInputWithoutNull("field", aField);
		newSelectItemsInArray.setInputWithoutNull("outputName", aOutputName);
		
		return newSelectItemsInArray;
	}
}

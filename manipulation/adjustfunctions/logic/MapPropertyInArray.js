import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import MapPropertyInArray from "wprr/manipulation/adjustfunctions/logic/MapPropertyInArray";
/**
 * Adjust function that maps properties in array
 */
export default class MapPropertyInArray extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("property", SourceData.create("prop", "property"));
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
		delete aProps["property"];
	}
	
	/**
	 * Sets the class based on the prop.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/MapPropertyInArray::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let property = this.getInput("property", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		{
			let currentArray = input;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentItem = currentArray[i];
				returnArray.push(objectPath.get(currentItem, property));
			}
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput		SourceData|Array	The data to group.
	 * @param	aProperty	SourceData|String	The path to the property to select.
	 * @param	aOutputName	SourceData|String	The output name to stroe the data in
	 *
	 * @return	MapPropertyInArray	The new instance.
	 */
	static create(aInput = null, aProperty = null, aOutputName = null) {
		let newMapPropertyInArray = new MapPropertyInArray();
		
		newMapPropertyInArray.setInputWithoutNull("input", aInput);
		newMapPropertyInArray.setInputWithoutNull("property", aProperty);
		newMapPropertyInArray.setInputWithoutNull("outputName", aOutputName);
		
		return newMapPropertyInArray;
	}
}

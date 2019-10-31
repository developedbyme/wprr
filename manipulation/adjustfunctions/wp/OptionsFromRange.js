import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import OptionsFromRange from "wprr/manipulation/adjustfunctions/wp/OptionsFromRange";
/**
 * Adjust function that creates options from a range
 */
export default class OptionsFromRange extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.range = SourceData.create("prop", "input");
		this.setInput("keyField", "id");
		this.setInput("labelField", "title");
		this.outputName = "options";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aRange		Array | SourceData	The range that is used to create options.
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	OptionsFromRange	self
	 */
	setup(aRange = null,  aOutputName = null) {
		
		if(aRange !== null) {
			this.range = aRange;
		}
		if(aOutputName !== null) {
			this.outputName = aOutputName;
		}
		
		return  this;
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["input"];
		delete aProps["outputName"];
	}
	
	/**
	 * Creates the options from the range.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/OptionsFromRange::adjust");
		
		let range = this.resolveSource(this.range, aData, aManipulationObject);
		let keyField = this.getInput("keyField", aData, aManipulationObject);
		let labelField = this.getInput("labelField", aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		if(!range) {
			console.error("Range is not set",  this);
			return returnArray;
		}
		
		let currentArray = range;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			returnArray.push({"value": objectPath.get(currentItem, keyField), "label": objectPath.get(currentItem, labelField), "additionalData": currentItem});
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aRange	Array | SourceData	The range that is used to create options.
	 * @param	aOutputName	String			The name of the prop to set the data to.
	 *
	 * @return	OptionsFromRange	The new instance.
	 */
	static create(aRange = null, aOutputName = null) {
		let newOptionsFromRange = new OptionsFromRange();
		
		newOptionsFromRange.setup(aRange, aOutputName);
		
		return newOptionsFromRange;
	}
}

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import AnyOf from "wprr/manipulation/adjustfunctions/logic/AnyOf";
/**
 * Adjust function that creates content from an array of data.
 */
export default class AnyOf extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.data = SourceData.create("prop", "input");
		this.matchingValues = SourceData.create("prop", "matchingValues");
		this.outputName = "output";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aData					* | SourceData			The data array to logic over.
	 * @param	aMatchingValues			Array | SourceData		The array of values to match to.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	AnyOf	self
	 */
	setup(aData = null, aMatchingValues = null, aOutputName = null) {
		
		if(aData !== null) {
			this.data = aData;
		}
		if(aMatchingValues !== null) {
			this.matchingValues = aMatchingValues;
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
		delete aProps["matchingValues"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/AnyOf::adjust");
		
		let returnArray = new Array();
		
		let matchingValues = this.resolveSource(this.matchingValues, aData, aManipulationObject);
		let data = this.resolveSource(this.data, aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		let returnValue = (matchingValues.indexOf(data) !== -1);
		
		aData[outputName] = returnValue;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aData					* | SourceData			The data array to logic over.
	 * @param	aMatchingValues			Array | SourceData		The array of values to match to.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	AnyOf	The new instance.
	 */
	static create(aData = null, aMatchingValues = null, aOutputName = null) {
		let newAnyOf = new AnyOf();
		
		newAnyOf.setup(aData, aMatchingValues, aOutputName);
		
		return newAnyOf;
	}
}

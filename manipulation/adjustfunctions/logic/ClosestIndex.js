import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import ClosestIndex from "wprr/manipulation/adjustfunctions/logic/ClosestIndex";
/**
 * Adjust function that creates content from an array of data.
 */
export default class ClosestIndex extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.data = SourceData.create("prop", "input");
		this.index = SourceData.create("prop", "index");
		this.numberOfItems = -1;
		this.outputName = "output";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aData					* | SourceData			The data array to logic over.
	 * @param	aIndex					Number | SourceData		The index to be close to.
	 * @param	aNumberOfItems			Number | SourceData		The number of items before the range repeats.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	ClosestIndex	self
	 */
	setup(aData = null, aIndex = null, aNumberOfItems = null, aOutputName = null) {
		
		if(aData !== null) {
			this.data = aData;
		}
		if(aIndex !== null) {
			this.index = aIndex;
		}
		if(aNumberOfItems !== null) {
			this.numberOfItems = aNumberOfItems;
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
		delete aProps["index"];
		delete aProps["numberOfItems"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/ClosestIndex::adjust");
		
		let index = this.resolveSource(this.index, aData, aManipulationObject);
		let data = this.resolveSource(this.data, aData, aManipulationObject);
		let numberOfItems = this.resolveSource(this.numberOfItems, aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		//METODO:
		let currentValue = Math.round(data);
		if(numberOfItems > 0) {
			let times = Math.floor(currentValue/numberOfItems);
			currentValue -= times*numberOfItems;
		}
		
		let returnValue = (currentValue === index);
		
		aData[outputName] = returnValue;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aData					* | SourceData			The input data.
	 * @param	aIndex					Number | SourceData		The index to be close to.
	 * @param	aNumberOfItems			Number | SourceData		The number of items before the range repeats.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	ClosestIndex	The new instance.
	 */
	static create(aData = null, aIndex = null, aNumberOfItems = null, aOutputName = null) {
		let newClosestIndex = new ClosestIndex();
		
		newClosestIndex.setup(aData, aIndex, aNumberOfItems, aOutputName);
		
		return newClosestIndex;
	}
}

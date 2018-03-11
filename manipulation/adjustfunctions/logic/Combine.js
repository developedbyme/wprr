import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import Combine from "wprr/manipulation/adjustfunctions/logic/Combine";
/**
 * Adjust function that combines values
 */
export default class Combine extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.data = [];
		this.outputName = "output";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aData					* | SourceData			The data array to logic over.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	Combine	self
	 */
	setup(aData = null, aOutputName = null) {
		
		if(aData !== null) {
			if(typeof(aData) === "string") {
				let dataArray = new Array();
				
				let currentArray = aData.split(",");
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentPropName = currentArray[i];
					dataArray.push(SourceData.create("prop", currentPropName));
				}
				this.data = dataArray;
			}
			else {
				this.data = aData;
			}
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
		//console.log("wprr/manipulation/adjustfunctions/logic/Combine::adjust");
		
		let data = this.resolveSource(this.data, aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		let currentArray = data;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(this.resolveSource(currentArray[i], aData, aManipulationObject));
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aData					String | Array | SourceData			The data to combine.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	Combine	The new instance.
	 */
	static create(aData = null, aOutputName = null) {
		let newCombine = new Combine();
		
		newCombine.setup(aData, aOutputName);
		
		return newCombine;
	}
}

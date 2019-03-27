import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import AdditionalDataFromOptions from "wprr/manipulation/adjustfunctions/text/AdditionalDataFromOptions";
/**
 * Adjust function that selects a additional data from options
 */
export default class AdditionalDataFromOptions extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.value = SourceData.create("prop", "value");
		this.options = SourceData.create("prop", "options");
		this.outputName = "output";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aValue					* | SourceData			The value to selecte the label for.
	 * @param	aOptions				Number | SourceData		The options to selecect from.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	AdditionalDataFromOptions	self
	 */
	setup(aValue = null, aOptions = null, aOutputName = null) {
		
		if(aValue !== null) {
			this.value = aValue;
		}
		if(aOptions !== null) {
			this.options = aOptions;
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
		delete aProps["value"];
		delete aProps["options"];
	}
	
	/**
	 * Sets the data from the selected option.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/text/AdditionalDataFromOptions::adjust");
		
		let value = this.resolveSource(this.value, aData, aManipulationObject);
		let options = this.resolveSource(this.options, aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		let selectedData = null;
		let currentArray = options;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOption = currentArray[i];
			if(value == currentOption.value) {
				selectedData = currentOption.additionalData;
				break;
			}
		}
		
		aData[outputName] = selectedData;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aValue					* | SourceData			The value to selecte the label for.
	 * @param	aOptions				Number | SourceData		The options to selecect from.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	AdditionalDataFromOptions	The new instance.
	 */
	static create(aValue = null, aOptions = null, aOutputName = null) {
		let newAdditionalDataFromOptions = new AdditionalDataFromOptions();
		
		newAdditionalDataFromOptions.setup(aValue, aOptions, aOutputName);
		
		return newAdditionalDataFromOptions;
	}
}

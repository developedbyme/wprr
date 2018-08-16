import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import OptionsFromTerms from "wprr/manipulation/adjustfunctions/wp/OptionsFromTerms";
/**
 * Adjust function that creates options from terms
 */
export default class OptionsFromTerms extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("terms", SourceData.create("prop", "input"));
		this.setInput("outputName", "options");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["terms"];
		delete aProps["outputName"];
	}
	
	/**
	 * Creates the options from the terms.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/OptionsFromTerms::adjust");
		
		let terms = this.getInput("terms", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnArray = new Array();
		
		let currentArray = terms;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			returnArray.push({"value": currentItem["id"], "label": currentItem["name"]});
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTerms		Array | SourceData	The terms taht are used to get the options for.
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	OptionsFromTerms	The new instance.
	 */
	static create(aTerms = null, aOutputName = null) {
		let newOptionsFromTerms = new OptionsFromTerms();
		
		newOptionsFromTerms.setInputWithoutNull("terms", aTerms);
		newOptionsFromTerms.setInputWithoutNull("outputName", aOutputName);
		
		return newOptionsFromTerms;
	}
}

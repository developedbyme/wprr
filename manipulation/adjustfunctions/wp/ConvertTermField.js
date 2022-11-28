import objectPath from "object-path";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import WpTermFunctions from "wprr/wp/WpTermFunctions";

//import ConvertTermField from "wprr/manipulation/adjustfunctions/wp/ConvertTermField";
/**
 * Adjust function that converts a term field
 */
export default class ConvertTermField extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("inputField", "id");
		this.setInput("outputField", "slug");
		this.setInput("terms", SourceData.create("prop", "terms"));
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
		delete aProps["terms"];
	}
	
	/**
	 * Converts the field
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/wp/ConvertTermField::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let inputField = this.getInput("inputField", aData, aManipulationObject);
		let outputField = this.getInput("outputField", aData, aManipulationObject);
		let terms = this.getInput("terms", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		//console.log(inputField, input, terms, outputField);
		aData[outputName] = objectPath.get(WpTermFunctions.getTermBy(inputField, input, terms), outputField);
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTerms		Array | SourceData	The terms that are used to get the hierarchy from.
	 * @param	aOutputName	String				The name of the prop to set the data to.
	 *
	 * @return	ConvertTermField	The new instance.
	 */
	static create(aInput = null, aInputField = null, aOutputField = null, aTerms = null, aOutputName = null) {
		let newConvertTermField = new ConvertTermField();
		
		newConvertTermField.setInputWithoutNull("input", aInput);
		newConvertTermField.setInputWithoutNull("inputField", aInputField);
		newConvertTermField.setInputWithoutNull("outputField", aOutputField);
		newConvertTermField.setInputWithoutNull("terms", aTerms);
		newConvertTermField.setInputWithoutNull("outputName", aOutputName);
		
		return newConvertTermField;
	}
}

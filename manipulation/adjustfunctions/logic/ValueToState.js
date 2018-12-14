import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import ValueToState from "wprr/manipulation/adjustfunctions/logic/ValueToState";
/**
 * Adjust function that gets a state from a value
 */
export default class ValueToState extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("states", {"default": "none", "states": []});
		this.setInput("outputName", "output");
		
	}
	
	setDefaultState(aState) {
		
		let statesObject = this.getRawInput("states");
		
		statesObject["default"] = aState;
		
		return this;
	}
	
	addState(aAtValue, aState) {
		
		let statesObject = this.getRawInput("states");
		statesObject["states"].push({"minValue": aAtValue, "state": aState});
		
		//METODO: sort array
		
		return this;
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["input"];
		delete aProps["states"];
		delete aProps["outputName"];
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
		//console.log("wprr/manipulation/adjustfunctions/logic/ValueToState::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let states = this.getInput("states", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let returnState = states["default"];
		let currentArray = states["states"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			if(currentData["minValue"] <= input) {
				returnState = currentData["state"];
			}
			else {
				break;
			}
		}
		
		aData[outputName] = returnState;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput		* | SourceData		The value input.
	 * @param	aOutputName	String | SourceData	The name of the prop to set the data to.
	 *
	 * @return	ValueToState	The new instance.
	 */
	static create(aInput = null, aOutputName = null) {
		let newValueToState = new ValueToState();
		
		newValueToState.setInputWithoutNull("input", aInput);
		newValueToState.setInputWithoutNull("outputName", aOutputName);
		
		return newValueToState;
	}
}

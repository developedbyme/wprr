import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import Ratio from "wprr/manipulation/adjustfunctions/logic/Ratio";
/**
 * Adjust function that creates a ratio
 */
export default class Ratio extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("input", SourceData.create("prop", "input"));
		this.setInput("ratio", SourceData.create("prop", "ratio"));
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
		delete aProps["ratio"];
	}
	
	/**
	 * Creates the ratio
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/logic/Ratio::adjust");
		
		let input = this.getInput("input", aData, aManipulationObject);
		let ratio = this.getInput("ratio", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		aData[outputName] = input*ratio;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aInput			SourceData|Number	The input value
	 * @param	aRatio			SourceData|Number	The ratio to scale to
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	Ratio	The new instance.
	 */
	static create(aInput = null, aRatio = null, aOutputName = null) {
		let newRatio = new Ratio();
		
		newRatio.setInputWithoutNull("input", aInput);
		newRatio.setInputWithoutNull("ratio", aRatio);
		newRatio.setInputWithoutNull("outputName", aOutputName);
		
		return newRatio;
	}
}

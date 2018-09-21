import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import StyleFromHeight from "wprr/manipulation/adjustfunctions/css/StyleFromHeight";
/**
 * Adjust function that creates a style from a height
 */
export default class StyleFromHeight extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("height", SourceData.create("prop", "height"));
		this.setInput("outputName", "style");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["width"];
		delete aProps["height"];
	}
	
	/**
	 * Creates the style
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/css/StyleFromHeight::adjust");
		
		let height = this.getInput("height", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let styleObject = new Object();
		
		styleObject["height"] = height;
		
		aData[outputName] = styleObject;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aHeight			SourceData|Number	The height
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	StyleFromHeight	The new instance.
	 */
	static create(aHeight = null, aOutputName = null) {
		let newStyleFromHeight = new StyleFromHeight();
		
		newStyleFromHeight.setInputWithoutNull("height", aHeight);
		newStyleFromHeight.setInputWithoutNull("outputName", aOutputName);
		
		return newStyleFromHeight;
	}
}

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import StyleFromWidth from "wprr/manipulation/adjustfunctions/css/StyleFromWidth";
/**
 * Adjust function that creates a style from a width
 */
export default class StyleFromWidth extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("width", SourceData.create("prop", "width"));
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
		//console.log("wprr/manipulation/adjustfunctions/css/StyleFromWidth::adjust");
		
		let width = this.getInput("width", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let styleObject = new Object();
		
		styleObject["width"] = width;
		
		aData[outputName] = styleObject;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aWidth			SourceData|Number	The width
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	StyleFromWidth	The new instance.
	 */
	static create(aWidth = null, aOutputName = null) {
		let newStyleFromWidth = new StyleFromWidth();
		
		newStyleFromWidth.setInputWithoutNull("width", aWidth);
		newStyleFromWidth.setInputWithoutNull("outputName", aOutputName);
		
		return newStyleFromWidth;
	}
}

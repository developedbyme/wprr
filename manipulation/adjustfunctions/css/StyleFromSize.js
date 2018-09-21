import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import StyleFromSize from "wprr/manipulation/adjustfunctions/css/StyleFromSize";
/**
 * Adjust function that creates a style from a width and height
 */
export default class StyleFromSize extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("width", SourceData.create("prop", "width"));
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
		//console.log("wprr/manipulation/adjustfunctions/css/StyleFromSize::adjust");
		
		let width = this.getInput("width", aData, aManipulationObject);
		let height = this.getInput("height", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let styleObject = new Object();
	
		styleObject["width"] = width;
		styleObject["height"] = height;
		
		aData[outputName] = styleObject;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aWidth			SourceData|Number	The width
	 * @param	aHeight			SourceData|Number	The height
	 * @param	aOutputName		SourceData|String	The output name to stroe the data in
	 *
	 * @return	StyleFromSize	The new instance.
	 */
	static create(aWidth = null, aHeight = null, aOutputName = null) {
		let newStyleFromSize = new StyleFromSize();
		
		newStyleFromSize.setInputWithoutNull("width", aWidth);
		newStyleFromSize.setInputWithoutNull("height", aHeight);
		newStyleFromSize.setInputWithoutNull("outputName", aOutputName);
		
		return newStyleFromSize;
	}
}

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import HtmlToText from "wprr/manipulation/adjustfunctions/text/HtmlToText";
/**
 * Adjust function that gets the text from an html string. 
 */
export default class HtmlToText extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("text", SourceData.create("prop", "text"));
		this.setInput("outputName", "text");
		
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["text"];
	}
	
	/**
	 * Converts the html to text
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/text/HtmlToText::adjust");
		
		let text = this.getInput("text", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		let formattingElement = document.createElement("div");
		formattingElement.innerHTML = text;

		let returnText = formattingElement.innerText;
		
		aData[outputName] = returnText;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aText					* | SourceData			The text to convert.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	HtmlToText	The new instance.
	 */
	static create(aText = null,  aOutputName = null) {
		let newHtmlToText = new HtmlToText();
		
		newHtmlToText.setInputWithoutNull("text", aText);
		newHtmlToText.setInputWithoutNull("outputName", aOutputName);
		
		return newHtmlToText;
	}
}

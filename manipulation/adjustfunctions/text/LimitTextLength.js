import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import LimitTextLength from "wprr/manipulation/adjustfunctions/text/LimitTextLength";
/**
 * Adjust function that keeps the text within a max length.
 */
export default class LimitTextLength extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.text = SourceData.create("prop", "text");
		this.maxLength = SourceData.create("prop", "maxLength");
		this.outputName = "text";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aText					* | SourceData			The text to limit.
	 * @param	aMaxLength				Number | SourceData		The max number of charcters to display.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	LimitTextLength	self
	 */
	setup(aText = null, aMaxLength = null, aOutputName = null) {
		
		if(aText !== null) {
			this.text = aText;
		}
		if(aMaxLength !== null) {
			this.maxLength = aMaxLength;
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
		delete aProps["text"];
		delete aProps["maxLength"];
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
		//console.log("wprr/manipulation/adjustfunctions/text/LimitTextLength::adjust");
		
		let text = this.resolveSource(this.text, aData, aManipulationObject);
		let maxLength = this.resolveSource(this.maxLength, aData, aManipulationObject);
		let outputName = this.outputName;
		
		this.removeUsedProps(aData);
		
		let returnValue = text;
		
		if(!isNaN(maxLength) && maxLength > 0) {
			let currentArray = text.split(" ");
			let newText = currentArray.shift();
			
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentWord = currentArray[i];
				if(newText.length + currentWord.length + 1 + 1 > maxLength) { //MENOTE: 1 for space and 1 for ...
					newText += "...";
					break;
				}
				newText += " " + currentWord;
			}
			
			returnValue = newText;
		}
		
		aData[outputName] = returnValue;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aText					* | SourceData			The text to limit.
	 * @param	aMaxLength				Number | SourceData		The max number of charcters to display.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	LimitTextLength	The new instance.
	 */
	static create(aText = null, aMaxLength = null, aOutputName = null) {
		let newLimitTextLength = new LimitTextLength();
		
		newLimitTextLength.setup(aText, aMaxLength, aOutputName);
		
		return newLimitTextLength;
	}
}

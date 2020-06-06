import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import StartOfArrayAsText from "wprr/manipulation/adjustfunctions/text/StartOfArrayAsText";
/**
 * Adjust function that gets a text from the start of an array.
 */
export default class StartOfArrayAsText extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("array", SourceData.create("prop", "input"));
		this.setInput("maxNumberOfItems", 4);
		this.setInput("outputName", "text");
		
		this.setInput("separatorText", ", ");
		this.setInput("lastSeparatorText", SourceData.create("translation", "and"));
		this.setInput("multipleOthersText", SourceData.create("translation", "and %number-of-items% other"));
		this.setInput("noItemsText", SourceData.create("translation", "no items"));
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["input"];
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
		//console.log("wprr/manipulation/adjustfunctions/text/StartOfArrayAsText::adjust");
		
		let array = this.getInput("array", aData, aManipulationObject);
		let maxNumberOfItems = this.getInput("maxNumberOfItems", aData, aManipulationObject);
		let outputName = this.getInput("outputName", aData, aManipulationObject);
		
		let arrayLength = array.length;
		
		let output;
		if(arrayLength === 0) {
			output = this.getInput("noItemsText", aData, aManipulationObject);
		}
		else {
			let listItems = new Array();
			let remainCount = 0;
			if(maxNumberOfItems > 0 && arrayLength > maxNumberOfItems) {
				listItems = array.slice(0, maxNumberOfItems-1);
				remainCount = arrayLength-(maxNumberOfItems-1);
			}
			else {
				listItems = [].concat(array);
			}
			
			if(remainCount === 0) {
				if(listItems.length === 1) {
					output = listItems[0];
				}
				else {
					let lastItem = listItems.pop();
					output = listItems.join(this.getInput("separatorText", aData, aManipulationObject));
					output += " " + this.getInput("lastSeparatorText", aData, aManipulationObject) + " " + lastItem;
				}
			}
			else {
				output = listItems.join(this.getInput("separatorText", aData, aManipulationObject));
				output += " " + this.getInput("multipleOthersText", aData, aManipulationObject).split("%number-of-items%").join(remainCount);
			}
		}
		
		aData[outputName] = output;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aArray					Array | SourceData		The array to list from.
	 * @param	aMaxNumberOfItems		Number | SourceData		The max number of items to display.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	StartOfArrayAsText	The new instance.
	 */
	static create(aArray = null, aMaxNumberOfItems = null, aOutputName = null) {
		let newStartOfArrayAsText = new StartOfArrayAsText();
		
		newStartOfArrayAsText.setInputWithoutNull("array", aArray);
		newStartOfArrayAsText.setInputWithoutNull("maxNumberOfItems", aMaxNumberOfItems);
		newStartOfArrayAsText.setInputWithoutNull("outputName", aOutputName);
		
		return newStartOfArrayAsText;
	}
}

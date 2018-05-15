import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import ContentCreatorLoop from "wprr/manipulation/adjustfunctions/loop/ContentCreatorLoop";
/**
 * Adjust function that creates content from an array of data.
 */
export default class ContentCreatorLoop extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.data = SourceData.create("prop", "input");
		this.contentCreator = SourceData.create("prop", "contentCreator");
		this.spacingContentCreator = SourceData.create("prop", "spacingContentCreator");
		this.noItemsContentCreator = SourceData.create("prop", "noItemsContentCreator");
		this.outputName = "dynamicChildren";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aData					* | SourceData			The data array to loop over.
	 * @param	aContentCreator			Function | SourceData	The content creator that will create the elements.
	 * @param	aSpacingContent			Function | SourceData	The fucntion that creates the spacing between items in the loop.
	 * @param	aNoItemsContentCreator	Function | SourceData	The content creator that runs if there are no items in the loop.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	ContentCreatorLoop	self
	 */
	setup(aData = null, aContentCreator = null, aSpacingContent = null, aNoItemsContentCreator = null, aOutputName = null) {
		
		if(aData !== null) {
			this.data = aData;
		}
		if(aContentCreator !== null) {
			this.contentCreator = aContentCreator;
		}
		if(aSpacingContent !== null) {
			this.spacingContentCreator = aSpacingContent;
		}
		if(aNoItemsContentCreator !== null) {
			this.noItemsContentCreator = aNoItemsContentCreator;
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
		delete aProps["input"];
		delete aProps["contentCreator"];
		delete aProps["spacingContentCreator"];
		delete aProps["noItemsContentCreator"];
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
		//console.log("wprr/manipulation/adjustfunctions/loop/ContentCreatorLoop::adjust");
		
		let returnArray = new Array();
		
		let contentCreator = this.resolveSource(this.contentCreator, aData, aManipulationObject);
		let spacingContentCreator = this.resolveSource(this.spacingContentCreator, aData, aManipulationObject);
		let noItemsContentCreator = this.resolveSource(this.noItemsContentCreator, aData, aManipulationObject);
		let dataArray = this.resolveSource(this.data, aData, aManipulationObject);
		let outputName = this.outputName;
		
		if(!contentCreator) {
			console.error("Loop doesn't have content creator.", this);
			
			aData[outputName] = returnArray;
			return aData;
		}
		
		this.removeUsedProps(aData);
		
		let currentArray = dataArray;
		if(currentArray) {
			let references = aManipulationObject.getReferences();
			
			let currentArrayLength = currentArray.length;
			if(currentArrayLength > 0) {
				for(let i = 0; i < currentArrayLength; i++) {
					let currentData = currentArray[i];
				
					if(spacingContentCreator != null && i !== 0) {
						spacingContentCreator(null, i, references, returnArray);
					}
					
					contentCreator(currentData, i, references, returnArray);
				}
			}
			else {
				if(noItemsContentCreator) {
					noItemsContentCreator(currentArray, 0, references, returnArray);
				}
			}
		}
		else {
			console.error("Data for loop not set correctly.", this);
		}
		
		aData[outputName] = returnArray;
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aData					* | SourceData			The data array to loop over.
	 * @param	aContentCreator			Function | SourceData	The content creator that will create the elements.
	 * @param	aSpacingContent			Function | SourceData	The fucntion that creates the spacing between items in the loop.
	 * @param	aNoItemsContentCreator	Function | SourceData	The content creator that runs if there are no items in the loop.
	 * @param	aOutputName				String					The name of the prop to set the data to.
	 *
	 * @return	ContentCreatorLoop	The new instance.
	 */
	static create(aData = null, aContentCreator = null, aSpacingContent = null, aNoItemsContentCreator = null, aOutputName = null) {
		let newContentCreatorLoop = new ContentCreatorLoop();
		
		newContentCreatorLoop.setup(aData, aContentCreator, aSpacingContent, aNoItemsContentCreator, aOutputName);
		
		return newContentCreatorLoop;
	}
}

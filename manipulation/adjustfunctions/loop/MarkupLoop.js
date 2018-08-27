import React from "react";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import UseMarkup from "wprr/markup/UseMarkup";

//import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
/**
 * Adjust function that creates markup from an array of data.
 */
export default class MarkupLoop extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.data = SourceData.create("prop", "input");
		this.markup = SourceData.create("prop", "markup");
		this.spacingMarkup = SourceData.create("prop", "spacingMarkup");
		this.noItemsMarkup = SourceData.create("prop", "noItemsMarkup");
		this.outputName = "dynamicChildren";
		
	}
	
	/**
	 * Sets up all the data for this adjust function. If null is used for any parameter it will not overwrite the current setting
	 *
	 * @param	aData			* | SourceData			The data array to loop over.
	 * @param	aMarkup			Function | SourceData	The markup that will create the elements.
	 * @param	aSpacingMarkup	Function | SourceData	The markup that creates the spacing between items in the loop.
	 * @param	aNoItemsMarkup	Function | SourceData	The markup that is used if there are no items in the loop.
	 * @param	aOutputName		String					The name of the prop to set the data to.
	 *
	 * @return	MarkupLoop	self
	 */
	setup(aData = null, aMarkup = null, aSpacingMarkup = null, aNoItemsMarkup = null, aOutputName = null) {
		
		if(aData !== null) {
			this.data = aData;
		}
		if(aMarkup !== null) {
			this.markup = aMarkup;
		}
		if(aSpacingMarkup !== null) {
			this.spacingMarkup = aSpacingMarkup;
		}
		if(aNoItemsMarkup !== null) {
			this.noItemsMarkup = aNoItemsMarkup;
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
		delete aProps["markup"];
		delete aProps["spacingMarkup"];
		delete aProps["noItemsMarkup"];
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
		//console.log("wprr/manipulation/adjustfunctions/loop/MarkupLoop::adjust");
		
		let returnArray = new Array();
		
		let markup = this.resolveSource(this.markup, aData, aManipulationObject);
		let spacingMarkup = this.resolveSource(this.spacingMarkup, aData, aManipulationObject);
		let noItemsMarkup = this.resolveSource(this.noItemsMarkup, aData, aManipulationObject);
		let dataArray = this.resolveSource(this.data, aData, aManipulationObject);
		let outputName = this.outputName;
		
		if(!markup) {
			console.error("Loop doesn't have any markup.", this);
			
			aData[outputName] = returnArray;
			return aData;
		}
		
		this.removeUsedProps(aData);
		
		let loopName = aManipulationObject.getSourcedPropWithDefault("loopName", "");
		if(loopName !== "") {
			loopName += "/";
		}
		
		let currentArray = dataArray;
		if(currentArray) {
			let references = aManipulationObject.getReferences();
			
			let currentArrayLength = currentArray.length;
			if(currentArrayLength > 0) {
				for(let i = 0; i < currentArrayLength; i++) {
					let currentData = currentArray[i];
				
					if(spacingMarkup != null && i !== 0) {
						let spacingInjectData = new Object();
						spacingInjectData["loop/" + loopName + "spacingIndex"] = i;
						
						returnArray.push(React.createElement(ReferenceInjection, {"key": "spacing-" + i, "injectData": spacingInjectData}, spacingMarkup));
					}
					
					let loopInjectData = new Object();
					loopInjectData["loop/" + loopName + "index"] = i;
					loopInjectData["loop/" + loopName + "item"] = currentData;
					returnArray.push(React.createElement(ReferenceInjection, {"key": "item-" + i, "injectData": loopInjectData}, markup));
				}
			}
			else {
				if(noItemsMarkup) {
					returnArray.push(noItemsMarkup);
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
	 * @param	aData			* | SourceData			The data array to loop over.
	 * @param	aMarkup			Function | SourceData	The markup that will create the elements.
	 * @param	aSpacingMarkup	Function | SourceData	The markup that creates the spacing between items in the loop.
	 * @param	aNoItemsMarkup	Function | SourceData	The markup thatis used if there are no items in the loop.
	 * @param	aOutputName		String					The name of the prop to set the data to.
	 *
	 * @return	MarkupLoop	The new instance.
	 */
	static create(aData = null, aMarkup = null, aSpacingMarkup = null, aNoItemsMarkup = null, aOutputName = null) {
		let newMarkupLoop = new MarkupLoop();
		
		newMarkupLoop.setup(aData, aMarkup, aSpacingMarkup, aNoItemsMarkup, aOutputName);
		
		return newMarkupLoop;
	}
}

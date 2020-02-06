import React from "react";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import UseMarkup from "wprr/markup/UseMarkup";

//import AlternatingMarkupLoop from "wprr/manipulation/adjustfunctions/loop/AlternatingMarkupLoop";
/**
 * Adjust function that creates alternating markup from an array of data.
 */
export default class AlternatingMarkupLoop extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.data = SourceData.create("prop", "input");
		this.itemPrefix = "item-";
		this.markup = SourceData.create("prop", "markup");
		this.spacingMarkup = SourceData.create("prop", "spacingMarkup");
		this.noItemsMarkup = SourceData.create("prop", "noItemsMarkup");
		this.outputName = "dynamicChildren";
		this.exceptions = new Object();
		
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
	 * @return	AlternatingMarkupLoop	self
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
		
		return this;
	}
	
	addException(aIndex, aMarkup) {
		
		this.exceptions["i"+aIndex] = aMarkup;
		
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
		//console.log("wprr/manipulation/adjustfunctions/loop/AlternatingMarkupLoop::adjust");
		
		let returnArray = new Array();
		
		let markup = this.resolveSource(this.markup, aData, aManipulationObject);
		let itemPrefix = this.resolveSource(this.itemPrefix, aData, aManipulationObject);
		let spacingMarkup = this.resolveSource(this.spacingMarkup, aData, aManipulationObject);
		let noItemsMarkup = this.resolveSource(this.noItemsMarkup, aData, aManipulationObject);
		let dataArray = this.resolveSource(this.data, aData, aManipulationObject);
		let outputName = this.outputName;
		
		if(!markup) {
			console.error("Loop doesn't have any markup.", this);
			
			aData[outputName] = returnArray;
			return aData;
		}
		
		if(!Array.isArray(markup)) {
			markup = [markup];
		}
		if(spacingMarkup && !Array.isArray(spacingMarkup)) {
			spacingMarkup = [spacingMarkup];
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
						
						let currentSpacingMarkup = spacingMarkup[(i-1)%spacingMarkup.length];
						
						returnArray.push(React.createElement(ReferenceInjection, {"key": "spacing-" + i, "injectData": spacingInjectData}, currentSpacingMarkup));
					}
					
					let loopInjectData = new Object();
					loopInjectData["loop/" + loopName + "index"] = i;
					loopInjectData["loop/" + loopName + "indexName"] = itemPrefix + i;
					loopInjectData["loop/" + loopName + "item"] = currentData;
					
					let currentMarkup = markup[i%markup.length];
					if(this.exceptions["i"+i]) {
						currentMarkup = this.exceptions["i"+i];
					}
					returnArray.push(React.createElement(ReferenceInjection, {"key": "item-" + i, "injectData": loopInjectData}, currentMarkup));
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
	 * @param	aMarkup			Function | Array | SourceData	The markup that will create the elements.
	 * @param	aSpacingMarkup	Function | Array | SourceData	The markup that creates the spacing between items in the loop.
	 * @param	aNoItemsMarkup	Function | SourceData	The markup thatis used if there are no items in the loop.
	 * @param	aOutputName		String					The name of the prop to set the data to.
	 *
	 * @return	AlternatingMarkupLoop	The new instance.
	 */
	static create(aData = null, aMarkup = null, aSpacingMarkup = null, aNoItemsMarkup = null, aOutputName = null) {
		let newAlternatingMarkupLoop = new AlternatingMarkupLoop();
		
		newAlternatingMarkupLoop.setup(aData, aMarkup, aSpacingMarkup, aNoItemsMarkup, aOutputName);
		
		return newAlternatingMarkupLoop;
	}
}

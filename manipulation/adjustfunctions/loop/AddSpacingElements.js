import React from "react";

import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import AddSpacingElements from "wprr/manipulation/adjustfunctions/loop/AddSpacingElements";
/**
 * Adjust function that adds spacing between each element
 */
export default class AddSpacingElements extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("elements", SourceData.create("prop", "dynamicChildren"));
		this.setInput("spacingMarkup", SourceData.create("prop", "spacingMarkup"));
		this.setInput("outputName", "dynamicChildren");
	}
	
	/**
	 * Function that removes the used props
	 *
	 * @param	aProps	Object	The props object that should be adjusted
	 */
	removeUsedProps(aProps) {
		//METODO: change this to actual source cleanup
		delete aProps["dynamicChildren"];
		delete aProps["spacingMarkup"];
	}
	
	/**
	 * Adds the spacing elements.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/loop/AddSpacingElements::adjust");
		
		let returnArray = new Array();
		
		let markup = this.getInput("spacingMarkup", aData, aManipulationObject);
		let spacingMarkup = this.getInput("spacingMarkup", aData, aManipulationObject);
		
		this.removeUsedProps(aData);
		
		let currentArray = this.getInput("elements", aData, aManipulationObject);
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(currentArray[i]);
			if(i < currentArrayLength-1) {
				returnArray.push(React.createElement(React.Fragment, {key: "spacing-" + i}, spacingMarkup});
			}
		}
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aData			Array | SourceData			The data array to loop over.
	 * @param	aOutputName		String					The name of the prop to set the data to.
	 *
	 * @return	AddSpacingElements	The new instance.
	 */
	static create(aElement = null, aSpacingMarkup = null, aOutputName = null) {
		let newAddSpacingElements = new AddSpacingElements();
		
		newJoinArray.setInputWithoutNull("elements", aElement);
		newJoinArray.setInputWithoutNull("spacingMarkup", aSpacingMarkup);
		newJoinArray.setInputWithoutNull("outputName", aOutputName);
		
		return newAddSpacingElements;
	}
}

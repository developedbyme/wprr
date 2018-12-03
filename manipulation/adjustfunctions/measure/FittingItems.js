import AdjustFunction from "wprr/manipulation/adjustfunctions/AdjustFunction";

import SourceData from "wprr/reference/SourceData";

//import FittingItems from "wprr/manipulation/adjustfunctions/measure/FittingItems";
/**
 * Adjust function that checks how many items that fits
 */
export default class FittingItems extends AdjustFunction {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		super();
		
		this.setInput("width", SourceData.create("prop", "width"));
		this.setInput("itemWidth", SourceData.create("prop", "itemWidth"));
		this.setInput("spacing", 0);
		this.setInput("maxNumberOfItems", 0);
		
	}
	
	_getNumberOfFittingItems(aReturnObject, aData, aManipulationObject) {
		//console.log("oa/react/FittingItemsProps::_selectProps");
		
		let currentWidth = this.getInput("width", aData, aManipulationObject);
		
		let itemWidth = this.getInput("itemWidth", aData, aManipulationObject);
		let spacing = this.getInput("spacing", aData, aManipulationObject);
		
		let extraWidth = Math.max(0, currentWidth-itemWidth);
		
		let numberOfFittingItems = 1+Math.floor(extraWidth/(itemWidth+spacing));
		
		let maxNumberOfItems = this.getInput("maxNumberOfItems", aData, aManipulationObject);
		if(maxNumberOfItems) {
			numberOfFittingItems = Math.min(numberOfFittingItems, maxNumberOfItems);
		}
		
		let adjustedItemWidth = (currentWidth-((numberOfFittingItems-1)*spacing))/numberOfFittingItems;
		
		aReturnObject["numberOfFittingItems"] = numberOfFittingItems;
		aReturnObject["adjustedItemWidth"] = adjustedItemWidth;
	}
	
	/**
	 * Checks how many items that fits.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		//console.log("wprr/manipulation/adjustfunctions/measure/FittingItems::adjust");
		
		this._getNumberOfFittingItems(aData, aData, aManipulationObject);
		
		delete aData["width"];
		delete aData["itemWidth"];
		
		return aData;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aWidth					Number | SourceData		The width of the container element.
	 * @param	aItemWidth				Number | SourceData		The min width of each item.
	 * @param	aSpacing				Number | SourceData		The spacing between the items.
	 * @param	aMaxNumberOfItems		Number | SourceData		The max number of items allowed per row.
	 *
	 * @return	FittingItems	The new instance.
	 */
	static create(aWidth = null, aItemWidth = null, aSpacing = null, aMaxNumberOfItems = null) {
		let newFittingItems = new FittingItems();
		
		newFittingItems.setInputWithoutNull("width", aWidth);
		newFittingItems.setInputWithoutNull("itemWidth", aItemWidth);
		newFittingItems.setInputWithoutNull("spacing", aSpacing);
		newFittingItems.setInputWithoutNull("maxNumberOfItems", aMaxNumberOfItems);
		
		return newFittingItems;
	}
}

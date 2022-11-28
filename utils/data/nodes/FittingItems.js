import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import FittingItems from "./FittingItems";
export default class FittingItems extends BaseObject {
	
	constructor() {
		super();
		
		this._valueUpdatedCommand = Wprr.commands.callFunction(this, this._valueUpdated);
		
		this.createSource("size", 0).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("itemMinSize", 200).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("itemMaxSize", 0).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("spacing", 0).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("maxNumberOfItems", 0).addChangeCommand(this._valueUpdatedCommand);
		
		this.createSource("numberOfItems", 0);
		this.createSource("itemSize", 0);
		this.createSource("adjustedSpacing", 0);
	}
	
	_valueUpdated() {
		//console.log("_valueUpdated");
		//console.log(this);
		
		let size = this.size;
		//console.log(size)
		if(!size) {
			this.numberOfItems = 0;
			this.itemSize = 0;
			this.adjustedSpacing = this.spacing;
			return;
		}
		
		let itemWidth = this.itemMinSize;
		
		
		let spacing = this.spacing;
		
		let extraWidth = Math.max(0, size-itemWidth);
		
		let numberOfFittingItems = 1+Math.floor(extraWidth/(itemWidth+spacing));
		
		let maxNumberOfItems = this.maxNumberOfItems;
		if(maxNumberOfItems) {
			numberOfFittingItems = Math.min(numberOfFittingItems, maxNumberOfItems);
		}
		
		let adjustedItemSize = (size-((numberOfFittingItems-1)*spacing))/numberOfFittingItems;
		
		if(this.itemMaxSize) {
			adjustedItemSize = Math.min(adjustedItemSize, this.itemMaxSize);
		}
		
		this.numberOfItems = numberOfFittingItems;
		this.itemSize = adjustedItemSize;
		this.adjustedSpacing = (numberOfFittingItems-1)*(size-numberOfFittingItems*adjustedItemSize);
		
		//console.log(numberOfFittingItems, adjustedItemSize, this.adjustedSpacing);
		
	}
	
	static connect(aSize, aItemMinSize = null, aItemMaxSize = null, aMaxNumberOfItems = null, aSpacing = null) {
		//console.log("FittingItems::connect");
		
		let newFittingItems = new FittingItems();
		
		newFittingItems.sources.get("size").input(aSize);
		if(aItemMinSize !== null) {
			newFittingItems.sources.get("itemMinSize").input(aItemMinSize);
		}
		if(aItemMaxSize !== null) {
			newFittingItems.sources.get("itemMaxSize").input(aItemMaxSize);
		}
		if(aMaxNumberOfItems !== null) {
			newFittingItems.sources.get("maxNumberOfItems").input(aMaxNumberOfItems);
		}
		if(aSpacing !== null) {
			newFittingItems.sources.get("spacing").input(aSpacing);
		}
		
		
		return newFittingItems;
	}
}
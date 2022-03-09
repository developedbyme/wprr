import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

//import SliderDisplay from "wprr/elements/area/slider/SliderDisplay";
export default class SliderDisplay extends WprrBaseObject {
	
	constructor(props) {
		super(props);
		
		this._maxHeight = Wprr.sourceValue(0);
	}
	
	_updateHeight(aElement) {
		console.log("_updateHeight");
		console.log(aElement);
		
		let elementHeight = Wprr.objectPath(aElement.getMainElement(), "clientHeight");
		console.log(elementHeight);
		
		this._maxHeight.value = Math.max(this._maxHeight.value, elementHeight);
		
		if(!elementHeight) {
			setTimeout((function() {
				this._updateHeight(aElement);
			}).bind(this), 0.1*1000);
		}
	}
	
	_getStartIndex(aPosition, aContainerWidth, aItemWidth, aSpacing) {
		let focusIndex = Math.floor(aPosition);
		return focusIndex;
	}
	
	_getNumberOfVisibleItems(aPosition, aContainerWidth, aItemWidth, aSpacing) {
		//console.log("wprr/elements/area/slider/SliderDisplay::_getNumberOfVisibleItems");
		//console.log(aPosition, aContainerWidth, aItemWidth, aSpacing);
		
		let numberOfItemsFitting = (aContainerWidth/(aItemWidth+aSpacing));
		let focusIndex = Math.floor(aPosition);
		
		if(focusIndex !== aPosition) {
			numberOfItemsFitting++;
		}
		
		return numberOfItemsFitting;
	}
	
	_modWithNegative(aValue, aMod) {
		let times = Math.floor(aValue/aMod);
		let newValue = aValue-times*aMod;
		return newValue;
	}
	
	_getScreenPosition(aItemIndex, aPosition, aItemWidth, aSpacing) {
		
		let movementParameter = aItemIndex-aPosition;
		let movement = (aItemWidth+aSpacing)*movementParameter;
		
		return movement;
	}
	
	_getViewData(aItems, aPosition, aContainerWidth, aItemWidth, aSpacing) {
		let returnObject = new Object();
		
		let startIndex = this._getStartIndex(aPosition, aContainerWidth, aItemWidth, aSpacing);
		
		returnObject["startIndex"] = startIndex;
		returnObject["items"] = returnArray;
		
		return returnObject;
	}
	
	_renderPlacedItems(aItems) {
		//console.log("wprr/elements/area/slider/SliderDisplay::_renderPlacedItems");
		
		let containerWidth = this.getFirstInput("width");
		let itemWidth = this.getFirstInput("itemWidth", Wprr.sourceProp("width"));
		let spacing = this.getFirstInputWithDefault("spacing", 0);
		let position = this.getFirstInputWithDefault("position", 0);
		let adjustSpacing = this.getFirstInputWithDefault("adjustSpacing", false);
		
		let placementClasses = "absolute-for-transform";
		let propPlacementClassName = this.getFirstInput("placementClassName");
		if(propPlacementClassName) {
			placementClasses += " " + propPlacementClassName;
		}
		
		let returnArray = new Array();
		
		if(containerWidth === 0) {
			return returnArray;
		}
		
		if(adjustSpacing) {
			let calculateOnFittingItems = Math.max(1, Math.floor(this._getNumberOfVisibleItems(0, containerWidth, itemWidth, spacing)));
			if(calculateOnFittingItems > 1) {
				spacing = (containerWidth-(itemWidth*calculateOnFittingItems))/(calculateOnFittingItems-1);
			}
		}
		
		let startIndex = this._getStartIndex(position, containerWidth, itemWidth, spacing);
		let numberOfVisibleItems = this._getNumberOfVisibleItems(position, containerWidth, itemWidth, spacing);
		
		let numberOfItems = aItems.length;
		
		for(let i = 0; i < numberOfVisibleItems; i++) {
			
			let globalIndex = startIndex+i;
			let currentIndex = this._modWithNegative(globalIndex, numberOfItems);
			
			let currentElement = aItems[currentIndex];
			
			let screenPosition = this._getScreenPosition(globalIndex, position, itemWidth, spacing);
			
			let styleObject = {
				"transform": "translateX(" + screenPosition + "px)",
				"width": itemWidth
			}
			
			returnArray.push(React.createElement(Wprr.BaseObject, {"className": placementClasses, "key": "placement-" + globalIndex, "style": styleObject, didMountCommands: Wprr.commands.callFunction(this, this._updateHeight, [Wprr.source("commandElement")])}, currentElement));
		}
		
		return returnArray;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/area/slider/SliderDisplay::_renderMainElement");
		
		let items = ReactChildFunctions.getInputChildrenForComponent(this);
		let placedItems = this._renderPlacedItems(items);
		
		let updateHeight = this.getFirstInput("updateHeight");
		if(updateHeight) {
			return React.createElement("div", {}, 
				React.createElement(Wprr.BaseObject, {"style": Wprr.source("object", {"height": this._maxHeight}), "sourceUpdates": this._maxHeight}, placedItems)
			);
		}
		
		return React.createElement("div", {}, placedItems);
	}
}

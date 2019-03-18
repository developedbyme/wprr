import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

//import SliderDisplay from "wprr/elements/area/slider/SliderDisplay";
export default class SliderDisplay extends WprrBaseObject {
	
	constructor(props) {
		super(props);
	}
	
	_getStartIndex(aPosition, aContainerWidth, aItemWidth, aSpacing) {
		let focusIndex = Math.floor(aPosition);
		return focusIndex;
	}
	
	_getNumberOfVisibleItems(aPosition, aContainerWidth, aItemWidth, aSpacing) {
		//console.log("wprr/elements/area/slider/SliderDisplay::_getNumberOfVisibleItems");
		//console.log(aPosition, aContainerWidth, aItemWidth, aSpacing);
		
		let numberOfItemsFitting = (aContainerWidth/aItemWidth);
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
		
		let containerWidth = this.getSourcedProp("width");
		let itemWidth = this.getSourcedPropWithDefault("itemWidth", SourceData.create("prop", "width"));
		let spacing = this.getSourcedPropWithDefault("spacing", 0);
		let position = this.getSourcedPropWithDefault("position", 0);
		
		let placementClasses = "absolute-for-transform";
		let propPlacementClassName = this.getSourcedProp("placementClassName");
		if(propPlacementClassName) {
			placementClasses += " " + propPlacementClassName;
		}
		
		let returnArray = new Array();
		
		if(containerWidth === 0) {
			return returnArray;
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
			
			returnArray.push(React.createElement("div", {"className": placementClasses, "key": "placement-" + globalIndex, "style": styleObject}, currentElement));
		}
		
		return returnArray;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/area/slider/SliderDisplay::_renderMainElement");
		
		let items = ReactChildFunctions.getInputChildrenForComponent(this);
		let placedItems = this._renderPlacedItems(items);
		
		return React.createElement("wrapper", {}, placedItems);
	}
}

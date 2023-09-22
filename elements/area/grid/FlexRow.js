import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import FlexRow from "wprr/elements/area/grid/FlexRow";
export default class FlexRow extends WprrBaseObject {

	_construct() {
		super._construct();
		
		this._mainElementType = "div";
		
		this._addMainElementClassName("flex-row");
	}
	
	_getChildren() {
		//console.log("wprr/elements/area/grid/FlexRow::_getChildren");
		
		let children = this.props.dynamicChildren ? this.getSourcedProp("dynamicChildren") : this.props.children;
		
		if(children) {
			let returnArray = Array.isArray(children) ? children : [children];
			return returnArray;
		}
		
		return null;
	}
	
	_getItemClassName(aChild, aKeyIndex) {
		
		let returnString = "flex-row-item";
		let itemClasses = this.getSourcedProp("itemClasses");
		if(itemClasses) {
			itemClasses = Wprr.utils.array.arrayOrSeparatedString(itemClasses);
			if(itemClasses[aKeyIndex]) {
				returnString += " " + itemClasses[aKeyIndex];
			}
		}
		
		return returnString;
	}
	
	_getFlexItem(aChild, aKeyIndex) {
		
		let itemHolderType = this.getFirstInputWithDefault("itemHolderType", "div");
		
		return React.createElement(itemHolderType, {"key": "flex-item-"+aKeyIndex, className: this._getItemClassName(aChild, aKeyIndex)}, aChild);
	}
	
	_getFlexItems() {
		
		let returnArray = new Array();
		
		let spacingMarkup = this.getSourcedProp("spacingMarkup");
		
		let currentArray = this._getChildren();
		if(currentArray) {
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentChild = currentArray[i];
				returnArray.push(this._getFlexItem(currentChild, i));
				if(i < currentArrayLength-1 && spacingMarkup) {
					returnArray.push(React.createElement(React.Fragment, {"key": "spacing-" + i}, spacingMarkup));
				}
			}
		}
		else {
			console.warn("Row doesn't have any elements.", this);
		}
		
		return returnArray;
	}

	_renderMainElement() {
		return React.createElement("wrapper", {}, this._getFlexItems());
	}
}
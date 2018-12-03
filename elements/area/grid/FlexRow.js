import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import FlexRow from "wprr/elements/area/grid/FlexRow";
export default class FlexRow extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this._mainElementType = "div";
		
		this._addMainElementClassName("flex-row");
	}
	
	_getChildren() {
		//console.log("wprr/elements/area/grid/FlexRow::_getChildren");
		
		var children = this.props.dynamicChildren ? this.getSourcedProp("dynamicChildren") : this.props.children;
		
		if(children) {
			var returnArray = Array.isArray(children) ? children : [children];
			return returnArray;
		}
		
		return null;
	}
	
	_getItemClassName(aChild, aKeyIndex) {
		
		var returnString = "flex-row-item";
		if(this.props.itemClasses && this.props.itemClasses[aKeyIndex]) {
			returnString += " " + this.props.itemClasses[aKeyIndex];
		}
		
		return returnString;
	}
	
	_getFlexItem(aChild, aKeyIndex) {
		return React.createElement("div", {"key": "flex-item-"+aKeyIndex, className: this._getItemClassName(aChild, aKeyIndex)}, aChild);
	}
	
	_getFlexItems() {
		
		var returnArray = new Array();
		
		let spacingMarkup = this.getSourcedProp("spacingMarkup");
		
		var currentArray = this._getChildren();
		if(currentArray) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentChild = currentArray[i];
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
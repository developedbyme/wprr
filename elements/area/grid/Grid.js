import React from 'react';
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import FlexRow from "wprr/elements/area/grid/FlexRow";

//import Grid from "wprr/elements/area/grid/Grid";
export default class Grid extends WprrBaseObject {

	_construct() {
		super._construct();
		
		this._rowClassNames = new Array();
		
		this._rowContentCreatorPath = Grid.DEFAULT_ROW_CONTENT_CREATOR_PATH;
		this._rowSpacingContentCreatorPath = Grid.DEFAULT_ROW_SPACING_CONTENT_CREATOR_PATH;
	}
	
	_adjustEndRows(aRowsData) {
		//MENOTE: do nothing
	}
	
	_getDefaultRowClassNames() {
		var returnArray = new Array();
		returnArray = returnArray.concat(this._rowClassNames);
		
		if(this.props.rowClassName) {
			returnArray.push(this.props.rowClassName);
		}
		
		return returnArray;
	}
	
	_getRowClassNames(aRowsData) {
		
		return this._getDefaultRowClassNames();
	}
	
	_updateRowSettings(aRowData, aRowIndex, aNumberOfRows) {
		aRowData.rowIndex = aRowIndex;
		aRowData.numberOfRows = aNumberOfRows;
		
		aRowData.className = this._getRowClassNames(aRowData).join(" ");
		aRowData.itemClasses = this.props.itemClasses;
	}
	
	_updateRowsSettings(aRowsData) {
		var currentArray = aRowsData;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._updateRowSettings(currentArray[i], i, currentArrayLength);
		}
	}
	
	_createRowData(aChildren) {
		return {
			"children": aChildren,
			"spacingMarkup": this.getSourcedProp("spacingMarkup")
		};
	}
	
	_startSplitUpChildren() {
		//MENOTE: do nothing
	}
	
	_updateSplit(aRowItems, aReturnArray) {
		return aRowItems;
	}
	
	_endSplit(aRowItems, aReturnArray) {
		//console.log("wprr/elements/area/grid/Grid::_endSplit");
		
		aReturnArray.push(this._createRowData(aRowItems));
	}
	
	_getChildren() {
		//console.log("wprr/elements/area/grid/Grid::_getChildren");
		
		var children = this.props.dynamicChildren ? this.props.dynamicChildren : this.props.children;
		
		if(children) {
			var returnArray = Array.isArray(children) ? children : [children];
			return returnArray;
		}
		
		return null;
	}
	
	_splitUpChildren() {
		//console.log("wprr/elements/area/grid/Grid::_splitUpChildren");
		
		var returnArray = new Array();
		
		var currentRowItems = new Array();
		this._startSplitUpChildren();
		
		var currentArray = this._getChildren();
		if(currentArray) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentChild = currentArray[i];
				currentRowItems.push(currentChild);
				currentRowItems = this._updateSplit(currentRowItems, returnArray);
			}
		}
		if(currentRowItems.length > 0) {
			this._endSplit(currentRowItems, returnArray);
		}
		
		this._adjustEndRows(returnArray);
		this._updateRowsSettings(returnArray);
		
		return returnArray;
	}
	
	_getRowContentCreator() {
		let rowContentCreator = this.getSourcedPropWithDefault("rowContentCreatorPath", Grid._contentCreator_row);
		
		return rowContentCreator;
	}
	
	_getRows() {
		//console.log("wprr/elements/area/grid/Grid::_getRows");
		
		let references = this.getReferences();
		
		var rowContentCreator = this._getRowContentCreator();
		var rowSpacingContentCreator = this.getSourcedPropWithDefault("rowSpacingContentCreatorPath", Grid._contentCreator_rowSpacing);
		let rowSpacingMarkup = this.getSourcedProp("rowSpacingMarkup");
		
		var returnArray = new Array();
		
		var currentArray = this._splitUpChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			returnArray.push(rowContentCreator(currentArray[i], i, references));
			if(i < currentArrayLength-1) {
				if(rowSpacingMarkup) {
					returnArray.push(React.createElement(React.Fragment, {"key": "spacing-" + i}, rowSpacingMarkup));
				}
				else if(rowSpacingContentCreator) {
					returnArray.push(rowSpacingContentCreator(null, i, references));
				}
			}
		}
		
		return returnArray;
	}

	_renderMainElement() {
		//console.log("wprr/elements/area/grid/Grid::_renderMainElement");
		
		let rows = this._getRows();
		
		return React.createElement("div", {"className": "grid"}, rows);
	}

	static _contentCreator_row(aData, aKeyIndex, aReferences) {
		return React.createElement(FlexRow, {"key": "row-" + aKeyIndex, "className": aData.className, "itemClasses": aData.itemClasses, "spacingMarkup": aData.spacingMarkup}, aData.children);
	}

	static _contentCreator_rowSpacing(aData, aKeyIndex, aReferences) {
		return React.createElement("div", {"key": "spacing-" + aKeyIndex, "className": "spacing standard"});
	}
}
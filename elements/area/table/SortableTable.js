import React from 'react';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";
import SourceData from "wprr/reference/SourceData";
import Loop from "wprr/elements/create/Loop";
import Adjust from "wprr/manipulation/Adjust";
import SortArray from "wprr/manipulation/adjustfunctions/logic/SortArray";

//import SortableTable from "wprr/elements/area/table/SortableTable";
export default class SortableTable extends WprrBaseObject {

	constructor (props) {
		super(props);
		
		this.state["selectedIndex"] = 0;
		this.state["sortOrder"] = 1;
		
		this._shouldSort = true;
		
		this._mainElementType = "table";
		
		this._injectData = {
			"sort/compare/string": this._caseInsensitiveCompareFunction,
			"sort/compare/number": this._numericCompareFunction
		};
		
		this._headItemClickedBound = this._headItemClicked.bind(this);
	}
	
	getTableAsRowArrays() {
		var returnArray = new Array();
		
		var headerRowData = new Array();
		
		var currentArray2 = this.getSourcedProp("headerData");
		var currentArray2Length = currentArray2.length;
		for(var j = 0; j < currentArray2Length; j++) {
			var currentHeader = currentArray2[j];
		
			headerRowData.push(currentHeader["label"]);
		
		}
		
		returnArray.push(headerRowData);
		
		var currentArray = this._selectRows();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var currentRow = currentArray[i];
			var currentRowData = new Array();
			
			for(var j = 0; j < currentArray2Length; j++) {
			
				var currentHeader = currentArray2[j];
			
				currentRowData.push(this._getRowItemData(j, currentHeader["key"], currentRow));
			
			}
			
			returnArray.push(currentRowData);
		}
		
		return returnArray;
	}
	
	_headItemClicked(aIndex) {
		console.log("wprr/elements/area/table/SortableTable::_headItemClicked");
		
		var newState = new Object();
		
		if(this.state["selectedIndex"] === aIndex) {
			this.state["sortOrder"] *= -1;
		}
		else {
			this.state["selectedIndex"] = aIndex;
			this.state["sortOrder"] = 1;
		}
		
		this.setState(newState);
	}
	
	_renderHeadElement() {
		//console.log("wprr/elements/area/table/SortableTable::_renderHeadElement");
		
		let headerData = this.getSourcedProp("headerData");
		
		if(!headerData) {
			console.warn("Table doesn't have any header data");
			return null;
		}
		
		let loopData = new Array();
		let currentArray = headerData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			
			let clickCallback = null;
			if(this._shouldSort && (currentData["sortFunction"] !== "none")) {
				clickCallback = this._headItemClickedBound;
			}
			
			loopData.push({"index": i, "data": currentData, "selected": (this.state.selectedIndex === i), "sortOrder": this.state.sortOrder, "clickCallback": clickCallback});
		}
		
		return React.createElement(ContentCreatorSingleItem, {contentCreator: SourceData.create("reference", "contentCreators/table/head")},
			React.createElement(ContentCreatorSingleItem, {contentCreator: SourceData.create("reference", "contentCreators/table/headRow")},
				React.createElement(Loop, {input: loopData, contentCreator: SourceData.create("reference", "contentCreators/table/headRowItem")})
			)
		);
	}
	
	_numericCompareFunction(aA, aB) {
		
		aA = parseFloat(aA);
		aB = parseFloat(aB);
		
		if(aA < aB) {
			return -1;
		}
		else if(aA > aB) {
			return 1;
		}
		else {
			return 0;
		}
	}
	
	_defaultCompareFunction(aA, aB) {
		
		if(aA < aB) {
			return -1;
		}
		else if(aA > aB) {
			return 1;
		}
		else {
			return 0;
		}
	}
	
	_caseInsensitiveCompareFunction(aA, aB) {
		
		aA = (aA+"").toLowerCase();
		aB = (aB+"").toLowerCase();
		
		if(aA < aB) {
			return -1;
		}
		else if(aA > aB) {
			return 1;
		}
		else {
			return 0;
		}
	}
	
	_defaultSortFunction(aCompareFunction, aA, aB) {
		//console.log("wprr/elements/area/table/SortableTable::_defaultSortFunction");
		//console.log(aA, aB);
		
		let headerData = this.getSourcedProp("headerData");
		
		let currentIndex = this.state["selectedIndex"];
		let currentHeader = headerData[currentIndex];
		
		let aData = this._getRowItemData(currentIndex, currentHeader["key"], aA);
		let bData = this._getRowItemData(currentIndex, currentHeader["key"], aB);
		
		return aCompareFunction(aData, bData);
	}
	
	_sortRows(aReturnArray) {
		//console.log("wprr/elements/area/table/SortableTable::_sortRows");
		
		let headerData = this.getSourcedProp("headerData");
		
		let currentIndex = this.state["selectedIndex"];
		let currentHeader = headerData[currentIndex];
		
		let compareFunction = null;
		
		if(currentHeader.sortFunction) {
			if(this._injectData["sort/compare/" + currentHeader.sortFunction]) {
				compareFunction = this._injectData["sort/compare/" + currentHeader.sortFunction];
			}
			else {
				compareFunction = this.getReference("sort/compare/" + currentHeader.sortFunction);
			}
			
		}
		if(!compareFunction) {
			compareFunction = this._defaultCompareFunction;
		}
		
		aReturnArray.sort(this._defaultSortFunction.bind(this, compareFunction));
		
		if(this.state["sortOrder"] === -1) {
			aReturnArray.reverse();
		}
	}
	
	_getRows() {
		let returnArray = new Array()
		returnArray = returnArray.concat(this.getSourcedProp("rows"));
		
		return returnArray;
	}
	
	_selectRows() {
		
		let returnArray = this._getRows();
		
		if(this._shouldSort) {
			this._sortRows(returnArray);
		}
		
		return returnArray;
	}
	
	_getRowItemData(aIndex, aKey, aRowData) {
		return aRowData[aKey];
	}
	
	_getFormattedRowItemData(aIndex, aKey, aRowData) {
		//console.log("wprr/elements/area/table/SortableTable::_getFormattedRowItemData");
		return this._getRowItemData(aIndex, aKey, aRowData);
	}
	
	_getRowItemsData(aRowData) {
		//console.log("wprr/elements/area/table/SortableTable::_getRowItemsData");
		
		let returnArray = new Array();
		
		let headerData = this.getSourcedProp("headerData");
		
		let currentArray = headerData;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			
			let currentHeader = currentArray[i];
			
			returnArray.push(this._getFormattedRowItemData(i, currentHeader["key"], aRowData));
			
		}
		
		return returnArray;
	}
	
	_renderBodyElement() {
		//console.log("wprr/elements/area/table/SortableTable::_renderBodyElement");
		
		let headerData = this.getSourcedProp("headerData");
		
		let rowsLoopData = new Array();
		
		let currentArray = this._selectRows();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRow = currentArray[i];
			
			let cellsLoopData = new Array();
			
			let currentArray2 = this._getRowItemsData(currentRow);
			let currentArray2Length = currentArray2.length;
			for(let j = 0; j < currentArray2Length; j++) {
				let currentData = currentArray2[j];
				cellsLoopData.push({"index": j, "rowIndex": i, "data": currentData, "rowData": currentRow, "headerData": headerData[j]});
			}
			
			let cellsLoop = React.createElement(Loop, {input: cellsLoopData, contentCreator: SourceData.create("reference", "contentCreators/table/bodyRowItem")});
			
			rowsLoopData.push({"data": currentRow, "children": cellsLoop});
		}
		
		return React.createElement(ReferenceInjection, {injectData: {"tableHeaderData": headerData}},
			React.createElement(ContentCreatorSingleItem, {contentCreator: SourceData.create("reference", "contentCreators/table/body")},
				React.createElement(Loop, {input: rowsLoopData, contentCreator: SourceData.create("reference", "contentCreators/table/bodyRow")})
			)
		);
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/area/table/SortableTable::_renderMainElement");
		
		return React.createElement("wrapper", {},
			React.createElement(ReferenceInjection, {injectData: this._injectData},
				this._renderHeadElement(),
				this._renderBodyElement()
			)
		);
	}
}

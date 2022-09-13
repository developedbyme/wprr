import Wprr from "wprr/Wprr";

import KeyValueGenerator from "wprr/utils/KeyValueGenerator";

import objectPath from "object-path";

// import TableData from "wprr/utils/data/TableData";
export default class TableData {
	
	constructor() {
		this._columns = new KeyValueGenerator();
		this._rows = new Array();
		this._metaData = new Object();
	}
	
	getColumnIndex(aColumnId) {
		return this._columns.getIndexForKey(aColumnId);
	}
	
	getCellValue(aColumnId, aRowIndex) {
		let columnIndex = this.getColumnIndex(aColumnId);
		
		return this._rows[aRowIndex][aColumnId];
	}
	
	setCellValue(aColumnId, aRowIndex, aValue) {
		let columnIndex = this.getColumnIndex(aColumnId);
		
		this._rows[aRowIndex][aColumnId] = aValue;
		
		return this;
	}
	
	addColumn(aId, aLabel) {
		this._columns.addKeyLabel(aId, aLabel);
		
		return this;
	}
	
	addColumns(aColumns) {
		let normalizedColumns = KeyValueGenerator.normalizeArrayOrObject(aColumns);
		this._columns.addItems(normalizedColumns);
		
		return this;
	}
	
	addColumnMeta(aColumnId, aKey, aData) {
		objectPath.set(this._metaData, "column." + aColumnId + "." + aKey, aData);
		
		return this;
	}
	
	getColumnMeta(aColumnId, aKey) {
		return objectPath.get(this._metaData, "column." + aColumnId + "." + aKey);
	}
	
	updateColumnId(aIndex, aNewId) {
		this._columns._values[aIndex]["key"] = aNewId;
		
		return this;
	}
	
	addRow(aRow) {
		this._rows.push(aRow);
		
		return this;
	}
	
	addRows(aRows) {
		let currentArray = aRows;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this.addRow(currentArray[i]);
		}
		
		return this;
	}
	
	addRowsFromObjects(aRows) {
		let currentArray = aRows;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this.addRow(this.getRowFromObject(currentArray[i]));
		}
		
		return this;
	}
	
	getRows() {
		return this._rows;
	}
	
	getRowsAsObjects() {
		let returnArray = new Array();
		
		let currentArray = this.getRows();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRow = currentArray[i];
			returnArray.push(this.getObjectFromRow(currentRow));
		}
		
		return returnArray;
	}
	
	getColumnTitleRow() {
		let returnArray = new Array();
		
		let currentArray = this._columns.getAsArray();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentColumn = currentArray[i];
			returnArray.push(currentColumn["label"]);
		}
		
		return returnArray;
	}
	
	getRowFromObject(aObject) {
		let returnArray = new Array();
		
		let currentArray = this._columns.getAsArray();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentColumn = currentArray[i];
			returnArray.push(Wprr.objectPath(aObject, currentColumn["key"]));
		}
		
		return returnArray;
	}
	
	getObjectFromRow(aRowData) {
		let returnObject = new Object();
		
		let currentArray = this._columns.getAsArray();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentColumn = currentArray[i];
			
			if(aRowData[i] !== undefined) {
				returnObject[currentColumn["key"]] = aRowData[i];
			}
		}
		
		return returnObject;
	}
	
	trimAllCells() {
		let currentArray = this.getRows();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRow = currentArray[i];
			Wprr.utils.array.trimArray(currentRow);
		}
		
		return this;
	}
	
	deleteAllEmptyRows() {
		let currentArray = this.getRows();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRow = currentArray[i];
			if(!Wprr.utils.array.hasAnyValue(currentRow)) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		return this;
	}
	
	deleteAllRows() {
		
		let currentArray = this.getRows();
		currentArray.splice(0, currentArray.length);
		
		return this;
	}
	
	static create() {
		let newTableData = new TableData();
		
		return newTableData;
	}
}
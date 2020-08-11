import Wprr from "wprr/Wprr";

import xlsx from "xlsx";

import TableData from "./TableData";

// import XlsxImporter from "wprr/utils/data/XlsxImporter";
export default class XlsxImporter {
	
	static getWorkbook(aBinaryData) {
		return xlsx.read(aBinaryData, {"type": "binary", "cellDates": true});
	}
	
	static getSheetByIndex(aWorkbook, aIndex) {
		let firstSheetName = aWorkbook.SheetNames[0];
		let worksheet = aWorkbook.Sheets[firstSheetName];
		
		return worksheet;
	}
	
	static getRangeFromSheet(aWorksheet) {
		return xlsx.utils.decode_range(aWorksheet['!ref']);
	}
	
	static getRow(aWorksheet, aRowIndex) {
		let rowData = new Array();
		
		let range = XlsxImporter.getRangeFromSheet(aWorksheet);
		let rowLength = range.e.c;
		
		let cellAddress = {c: 0, r: aRowIndex};
		for(let i = 0; i < rowLength; i++) {
			cellAddress["c"] = i;
			
			let currentCell = aWorksheet[xlsx.utils.encode_cell(cellAddress)];
			if(currentCell) {
				rowData.push(currentCell["v"]);
			}
			else {
				rowData.push(undefined);
			}
			
		}
		
		return rowData;
	}
	
	static getRows(aWorksheet, aFromIndex, aToIndex) {
		
		let rows = new Array();
		
		for(let i = aFromIndex; i < aToIndex; i++) {
			rows.push(XlsxImporter.getRow(aWorksheet, i));
		}
		
		return rows;
	}
	
	static importFirstSheetWithTitleColumn(aBinaryData) {
		
		let workbook = XlsxImporter.getWorkbook(aBinaryData);
		let worksheet = XlsxImporter.getSheetByIndex(workbook, 0);
		
		let headers = XlsxImporter.getRow(worksheet, 0);
		{
			let currentArray = headers;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				if(currentArray[i] === undefined) {
					currentArray[i] = "column_" + i;
				}
			}
		}
		
		let range = XlsxImporter.getRangeFromSheet(worksheet);
		let rowLength = range.e.r;
		let rows = XlsxImporter.getRows(worksheet, 1, range.e.r);
		
		let returnTableData = new TableData();
		returnTableData.addColumns(headers);
		returnTableData.addRows(rows);
		
		return returnTableData;
	}
}
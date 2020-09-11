import Wprr from "wprr/Wprr";

import xlsx from "xlsx";
import {saveAs} from "file-saver";

import TableData from "./TableData";

function s2ab(s) {
	if(typeof ArrayBuffer !== 'undefined') {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	} else {
		var buf = new Array(s.length);
		for (var i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
}

// import XlsxExporter from "wprr/utils/data/XlsxExporter";
export default class XlsxExporter {
	
	constructor() {
		
		this._table = new TableData();
		
	}
	
	get table() {
		return this._table;
	}
	
	setColumnWidth(aColumnId, aWidth) {
		this._table.addColumnMeta(this._table.getColumnIndex(aColumnId), "xlsxSettings.wch", aWidth);
		
		return this;
	}
	
	setColumnFormat(aColumnId, aFormat) {
		this._table.addColumnMeta(this._table.getColumnIndex(aColumnId), "format", aFormat);
		
		return this;
	}
	
	setColumnDataType(aColumnId, aDataType) {
		this._table.addColumnMeta(this._table.getColumnIndex(aColumnId), "dataType", aDataType);
		
		return this;
	}
	
	cellRef(aColumn, aRow) {
		return xlsx.utils.encode_cell({c: aColumn, r: aRow});
	}
	
	save(aFileName = "export", aSheetName = "Master") {
		let workbook = {"SheetNames": [], "Sheets": {}};
		let sheetName = aSheetName;
		
		
		var workSheet = {};
		
		let titles = this._table.getColumnTitleRow();
		let numberOfColumns = titles.length;
		let rows = this._table.getRows();
		
		var range = {s: {c:0, r:0}, e: {c: titles.length, r: rows.length+1 }};
		var formats = new Array(numberOfColumns);
		var dataTypes = new Array(numberOfColumns);
		
		{
			let currentArray = titles;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let cellRef = this.cellRef(i, 0);
				
				let type = "s";
				
				let cell = {"v": currentArray[i], "t": "s"};
				
				workSheet[cellRef] = cell;
				
				formats[i] = this._table.getColumnMeta(i, "format");
				dataTypes[i] = this._table.getColumnMeta(i, "dataType");
			}
		}
		
		{
			let currentArray = rows;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentRow = currentArray[i];
				
				let currentArray2 = currentRow;
				let currentArray2Length = currentArray2.length;
		
				for(let j = 0; j < currentArray2Length; j++) {
					let currentValue = currentArray2[j];
					
					if(currentValue !== null && currentValue !== undefined) {
						let cellRef = this.cellRef(j, i+1);
						
						let type = "s";
						if(typeof(currentValue) === "number") {
							type = "n";
						}
						if(typeof(currentValue) === "boolean") {
							type = "b";
						}
						
						if(dataTypes[j]) {
							type = dataTypes[j];
						}
						
						//METODO: force type
				
						let cell = {"v": currentValue, "t": type};
						
						let currentFormat = formats[j];
						if(currentFormat) {
							cell.z = currentFormat;
						}
						
						workSheet[cellRef] = cell;
					}
				}
			}
		}
		
		workSheet['!ref'] = xlsx.utils.encode_range(range);
		
		var wscols = new Array(numberOfColumns);
		for(var i = 0; i < numberOfColumns; i++) {
			let settings = this._table.getColumnMeta(i, "xlsxSettings");
			if(!settings) {
				settings = {"wch": 20};
			}
			
			wscols[i] = settings;
		}

		workSheet['!cols'] = wscols;
		
		workbook.SheetNames.push(sheetName);
		workbook.Sheets[sheetName] = workSheet;

		var wbout = xlsx.write(workbook, {bookType: "xlsx", bookSST:true, type: 'binary'});
	
		let fileName = aFileName + ".xlsx";
	
		try {
			saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName);
		}
		catch(theError) {
			console.error("Could not export file.");
			console.log(theError);
		}
	}
	
	static saveRows(aRows, aColumns = null, aFileName = "export", aSheetName = "Master") {
		let workbook = {"SheetNames": [], "Sheets": {}};
		let sheetName = aSheetName;
		let workSheet = xlsx.utils.json_to_sheet(aRows, {header: aColumns});
	
		workbook.SheetNames.push(sheetName);
		workbook.Sheets[sheetName] = workSheet;

		var wbout = xlsx.write(workbook, {bookType: "xlsx", bookSST:true, type: 'binary'});
	
		let fileName = aFileName + ".xlsx";
	
		try {
			saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName);
		}
		catch(theError) {
			console.error("Could not export file.");
			console.log(theError);
		}
	}
}
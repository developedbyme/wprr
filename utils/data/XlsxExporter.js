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
import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import moment from "moment";

export default class ExportPages extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
	}
	
	_getAdminEditUrl(aId) {
		
		let urlResolver = this.getFirstInput(Wprr.sourceReference("urlResolver/site"));
		
		return urlResolver.resolveUrl("wp-admin/post.php?post=" + aId + "&action=edit", "site");
	}
	
	_export() {
		//console.log("_export");
		
		let selectedIds = this.getFirstInput(Wprr.sourceReference("externalStorage", "selection"));
		let items = this.getFirstInput(Wprr.sourceReference("items"));
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let selectedItems = items.getItems(selectedIds);
		
		let conversions = {
			"id": "id",
			"title": "data.title",
			"status": "data.status",
			"link": "data.permalink",
			"editLink": Wprr.sourceFunction(this, this._getAdminEditUrl, [Wprr.sourceEvent("item.id")]),
			
		};
		
		let rows = Wprr.utils.array.convertFields(selectedItems, conversions, this);
		
		let columns = [
			{"key": "id", "value": "Id"},
			{"key": "title", "value": "Title"},
			{"key": "status", "value": "Status"},
			{"key": "link", "value": "Link"},
			{"key": "editLink", "value": "Edit link"},
		];
		
		let xlsxExporter = new Wprr.utils.data.XlsxExporter();
		xlsxExporter.table.addColumns(columns);
		xlsxExporter.table.addRowsFromObjects(rows);
		
		
		
		xlsxExporter.setColumnWidth("id", 10);
		xlsxExporter.setColumnWidth("title", 40);
		xlsxExporter.setColumnWidth("status", 10);
		xlsxExporter.setColumnWidth("link", 80);
		xlsxExporter.setColumnWidth("editLink", 80);
		
		xlsxExporter.save("Pages");
	}
	
	_renderMainElement() {
		
		return React.createElement("div", null, 
			React.createElement(Wprr.FlexRow, null, 
				React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this._export)},
					React.createElement("div", {className: "standard-button standard-button-padding"},
						Wprr.translateText("Export")
					)
				)
			)
		);
	}
}

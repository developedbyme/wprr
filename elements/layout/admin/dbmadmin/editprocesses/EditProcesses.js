import React from "react";
import Wprr from "wprr";

import * as processAreas from "./cells/processAreas.js";

export default class EditProcesses extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit processes"));
		
		let fields = {
			"id": {"type": "select"},
			"name": {"type": "field"},
			"parts": {"type": "orderedRelations", "relationPath": "incoming.in.process-part", "orderId": "parts"},
			"tasks": {"type": "relations", "relationPath": "incoming.following.task"},
			"edit": {"type": "editProcess"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas, processAreas);
		
		return React.createElement("div", null,
			React.createElement(Wprr.layout.items.batch.BatchEditItems, {
				title: title,
				projectName: Wprr.sourceReference("wprr/projectName"),
				dataType: "process",
				fields: fields,
				cellTypes: areas
			})
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=process",
				"replacements": {}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings}, React.createElement("div", null));
	}
}

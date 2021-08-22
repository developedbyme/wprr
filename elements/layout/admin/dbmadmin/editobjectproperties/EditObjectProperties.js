import React from "react";
import Wprr from "wprr";

export default class EditObjectProperties extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit items"));
		
		let fields = {
			"id": {"type": "select"},
			"name": {"type": "field"},
			"identifier": {"type": "field"},
			"value": {"type": "field"},
			"pointingTo": {"type": "relationOfAnyType", "relationPath": "outgoing.for.any"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return React.createElement("div", null,
			React.createElement(Wprr.layout.items.batch.BatchEditItems, {
			  title: title,
			  projectName: Wprr.sourceReference("wprr/projectName"),
			  dataType: "object-property,named-item,value-item,identifiable-item",
			  fields: fields,
			  cellTypes: areas
			})
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=object-property",
				"replacements": {}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null, "Settings")
		);
	}
}

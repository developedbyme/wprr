import React from "react";
import Wprr from "wprr";

export default class EditImages extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit images"));
		
		let fields = {
			"id": {"type": "select"},
			"name": {"type": "field"},
			"value": {"type": "field"},
			"title": {"type": "field"},
			"description": {"type": "field", "fieldType": "richText"},
			"of": {"type": "relationOfAnyType", "relationPath": "outgoing.of.any"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		
		return React.createElement("div", null, React.createElement(Wprr.layout.items.batch.BatchEditItems, {
  title: title,
  projectName: Wprr.sourceReference("wprr/projectName"),
  dataType: "image,named-item",
  fields: fields,
  cellTypes: areas,
  operationSections: operationSections
}));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=image",
				"replacements": {}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null, "Settings"));
	}
}

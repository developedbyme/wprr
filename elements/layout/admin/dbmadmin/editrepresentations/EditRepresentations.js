import React from "react";
import Wprr from "wprr";

export default class EditRepresentations extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit global items"));
		
		let fields = {
			"id": {"type": "select"},
			"type": {"type": "singleRelation", "relationPath": "incoming.for.type/representation-type"},
			"for": {"type": "relationOfAnyType", "relationPath": "outgoing.for.any"},
			"url": {"type": "field"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.items.batch.BatchEditItems, {
  title: title,
  projectName: Wprr.sourceReference("wprr/projectName"),
  dataType: "representation",
  fields: fields,
  cellTypes: areas,
  operationSections: operationSections
}));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=representation",
				"replacements": {}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null, "Settings"));
	}
}

import React from "react";
import Wprr from "wprr/Wprr";

export default class EditTemplatePositions extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit template positions"));
		
		let fields = {
			"id": {"type": "select"},
			"identifier": {"type": "field"},
			"name": {"type": "field"},
			"templates": {"type": "relations", "relationPath": "incoming.available-at.content-template"},
			"options": {"type": "options"}
		};
		
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: "private",
  as: "publishStatus"
}, /*#__PURE__*/React.createElement(Wprr.layout.items.batch.BatchEditItems, {
  dataType: "template-position",
  namesToLoad: "content-template",
  taxonomiesToLoad: "dbm_relation",
  title: title,
  fields: fields,
  cellTypes: areas
})));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=template-position",
				"replacements": {}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement(Wprr.layout.form.FieldWithLabel, {
  valueName: "title",
  label: "Title",
  externalStorage: Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")
}));
	}
}

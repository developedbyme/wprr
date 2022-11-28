import React from "react";
import Wprr from "wprr/Wprr";

export default class EditEnumTypes extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let title = this.getFirstInput("title", Wprr.sourceReference("blockData", "title"), Wprr.sourceTranslation("Edit items"));
		
		let fields = {
			"id": {"type": "select"},
			"identifier": {"type": "field"},
			"name": {"type": "field"},
			"options": {"type": "options"}
		};
		
		let operationSections = Wprr.utils.object.shallowMerge(Wprr.layout.list.operations.adminOperationAreas);
		let areas = Wprr.utils.object.shallowMerge(Wprr.layout.list.cells.areas);
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {data: "publish", as: "publishStatus"},
				React.createElement(Wprr.layout.items.batch.BatchEditItems, {
					dataType: "type/enum-type,type",
					taxonomiesToLoad: "dbm_relation",
					title: title,
					fields: fields,
					cellTypes: areas,
					operationSections: operationSections
				})
			)
		);
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			"items": {
				"value": "wprr/v1/range/dbm_data/drafts,privates,relation/status,fields,editObjectRelations?type=type/enum-type",
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

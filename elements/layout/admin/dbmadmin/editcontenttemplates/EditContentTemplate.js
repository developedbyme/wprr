import React from "react";
import Wprr from "wprr/Wprr";

export default class EditContentTemplate extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName('centered-site');
	}
	
	_renderMainElement() {
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.items.EditItem, {
  item: Wprr.sourceReference("item")
}, /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "name"
}, /*#__PURE__*/React.createElement("h2", {
  className: "no-margins extra-small-label extra-small-label-padding"
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.FieldName, null)), /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null)), /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "title"
}, /*#__PURE__*/React.createElement("h2", {
  className: "no-margins extra-small-label extra-small-label-padding"
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.FieldName, null)), /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null)), /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "content"
}, /*#__PURE__*/React.createElement("h2", {
  className: "no-margins extra-small-label extra-small-label-padding"
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.FieldName, null)), /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, {
  type: "richText"
}))));
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			"item": {
				"value": "wprr/v1/range-item/dbm_data/drafts,privates,idSelection/status,fields,editObjectRelations?ids={id}",
				"replacements": {
					"{id}": {
						"type": "queryString",
						"path": "id",
					}
				}
			}
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null));
	}
}

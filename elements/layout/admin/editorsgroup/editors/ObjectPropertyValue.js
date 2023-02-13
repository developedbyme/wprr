import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class ObjectPropertyValue extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
	}
	
	_renderMainElement() {
		//console.log("ObjectPropertyValue::_renderMainElement");
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(Wprr.sourceReference("editorsGroup"), "getItemEditor", [Wprr.sourceReference("item", "id")]),
		  as: "itemEditor"
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("item", "terms.idsSource"),
		  compareValue: "dbm_type:object-property/linked-object-property",
		  checkType: "invert/arrayContains"
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("item", "terms.idsSource"),
		  compareValue: "dbm_type:value-item",
		  checkType: "arrayContains"
		}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["value"]),
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement(Wprr.JsonEditor, {
		  className: "standard-field standard-field-padding full-width",
		  value: Wprr.sourceReference("valueEditor", "valueSource")
		}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null))), /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("item", "terms.idsSource"),
		  compareValue: "dbm_type:file-value-item",
		  checkType: "arrayContains"
		}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["value"]),
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement("div", null, "File")))), /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("item", "terms.idsSource"),
		  compareValue: "dbm_type:object-property/linked-object-property",
		  checkType: "arrayContains"
		}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectAnyRelation, {
		  direction: "outgoing",
		  relationType: "pointing-to"
		}))))
		);
	}
}

import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-select");
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-text-small"
}, "\xA0"), /*#__PURE__*/React.createElement("div", {
  className: "content-text-small"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.MultipleSelectionValue, {
  value: Wprr.sourceReference("item", "id"),
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  valueName: "selected"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "standard-flag standard-flag-padding id-flag"
}, Wprr.text(Wprr.sourceReference("item", "id"))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "saved.status"),
  checkType: "equal",
  compareValue: "draft"
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-flag standard-flag-padding status-flag draft"
}, "Draft"))))));
	}
}
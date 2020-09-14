"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import BatchEditHeader from "./BatchEditHeader";
export default class BatchEditHeader extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "batchEditHeader";
	}

	_getLayout(aSlots) {
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, aSlots.slot("left", /*#__PURE__*/React.createElement("div", null, aSlots.slot("titleElement", /*#__PURE__*/React.createElement("h2", {
  className: "batch-edit-title no-margins"
}, Wprr.text(aSlots.prop("title", "Edit items")))), aSlots.slot("operations", /*#__PURE__*/React.createElement("div", null)))), aSlots.slot("right", /*#__PURE__*/React.createElement("div", null, aSlots.slot("searchStorage", /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: aSlots.prop("searchTextValueName", "searchText"),
  externalStorage: aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"))
}, aSlots.slot("searchField", /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: aSlots.useProp("searchTextValueName")
}))))))));
	}
}

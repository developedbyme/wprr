"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import FieldListItem from "./FieldListItem";
export default class FieldListItem extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("FieldListItem::constructor");

		super();
		
		this._layoutName = "fieldListItem";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {
  className: "standard-row standard-row-padding fit-content-width"
}, /*#__PURE__*/React.createElement("div", {
  className: "flex-row small-item-spacing"
}, aSlots.slot("fieldsExternalStorage", /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: "activeFields",
  externalStorage: aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"))
}, Wprr.Loop.createMarkupLoop(aSlots.prop("fields", Wprr.sourceProp("activeFields")), aSlots.default( /*#__PURE__*/React.createElement(Wprr.layout.items.batch.FieldCellItem, {
  cellId: Wprr.sourceReference("loop/item"),
  cellTypes: aSlots.prop("cellTypes", {})
})))))));
	}
}
"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import FieldCellItem from "./FieldCellItem";
export default class FieldCellItem extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("FieldCellItem::constructor");

		super();
		
		this._layoutName = "fieldCellItem";
	}
	
	_getLayout(aSlots) {
		
		let cellIdSource = aSlots.prop("cellId", "standard");
		let settingsSource = aSlots.prop("settings", Wprr.sourceReference("fields", Wprr.sourceCombine(cellIdSource)));
		let typeSource = aSlots.prop("fieldType", Wprr.sourceReference("fields", Wprr.sourceCombine(cellIdSource, ".type")));
		let switchableArea = Wprr.creators.SwitchableAreaCreator.getReactElementsForDynamicClasses(typeSource, aSlots.prop("cellTypes", {}), "standard");
		
		return React.createElement(Wprr.AddReference, {
  data: cellIdSource,
  as: "cellId"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: settingsSource,
  as: "cellSettings"
}, /*#__PURE__*/React.createElement(Wprr.AddProps, {
  className: Wprr.sourceCombine("flex-row-item flex-no-resize field-", cellIdSource, " wanted-field-type-", typeSource)
}, switchableArea)));;
	}
}
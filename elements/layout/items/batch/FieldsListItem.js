"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import FieldsListItem from "./FieldsListItem";
export default class FieldsListItem extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("FieldsListItem::constructor");

		super();
		
		this._layoutName = "fieldsListItem";
	}
	
	_getLayout(aSlots) {
		
		let externalActiveFieldsSource = Wprr.sourceReference("externalStorage", "activeFields");
		let fieldsProp = aSlots.prop("fields", externalActiveFieldsSource);
		
		return React.createElement("div", {className: "standard-row standard-row-padding fit-content-width"},
			React.createElement("div", {className: "flex-row small-item-spacing"},
				Wprr.Loop.createMarkupLoop(
					fieldsProp,
					aSlots.default(
						React.createElement(Wprr.layout.items.batch.FieldCellItem, {cellId: Wprr.sourceReference("loop/item"), cellTypes: aSlots.prop("cellTypes", Wprr.layout.list.cells.areas)})
					)
				)
			)
		);
	}
}
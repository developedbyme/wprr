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
		
		return React.createElement("div", {className: "standard-row standard-row-padding fit-content-width"},
			React.createElement("div", {className: "flex-row small-item-spacing"},
				aSlots.slot("fieldsExternalStorage",
					React.createElement(Wprr.ExternalStorageProps, {props: "activeFields", externalStorage: aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"))},
						Wprr.Loop.createMarkupLoop(
							aSlots.prop("fields", Wprr.sourceProp("activeFields")),
							aSlots.default(
								React.createElement(Wprr.layout.items.batch.FieldCellItem, {cellId: Wprr.sourceReference("loop/item"), cellTypes: aSlots.prop("cellTypes", Wprr.layout.list.cells.areas)})
							)
						)
					)
				)
			)
		);
	}
}
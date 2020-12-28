"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import ItemNames from "./ItemNames";
export default class ItemNames extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ItemNames::constructor");

		super();
		
		this._layoutName = "itemNames";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("span", {className: "items-names"},
			React.createElement(Wprr.Adjust, {adjust: [Wprr.adjusts.startOfArrayAsText(Wprr.sourceFunction(ItemNames, ItemNames.getItemNames, [aSlots.prop("ids", []), Wprr.sourceFirst(aSlots.prop("items", null), Wprr.sourceReference("items")), aSlots.prop("namePath", "data.title")]))], sourceUpdates: Wprr.sourceReference("itemNames/externalStorage", "slots.ids")},
				Wprr.text(null)
			)
		);
	}
	
	static getItemNames(aIds, aItems, aNamePath = "data.title") {
		//console.log("ItemNames::getItemNames");
		//console.log(aIds, aItems);
		
		let items = aItems.getItems(aIds);
		return Wprr.utils.array.mapField(items, aNamePath);
	}
}
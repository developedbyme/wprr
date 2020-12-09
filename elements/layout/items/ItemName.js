"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import ItemName from "./ItemName";
export default class ItemName extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ItemName::constructor");

		super();
		
		this._layoutName = "itemName";
	}
	
	_getLayout(aSlots) {
		
		let idSource  = aSlots.prop("id", 0);
		
		return React.createElement("span", {className: "items-name"},
			React.createElement(Wprr.HasData, {check: idSource, sourceUpdates: Wprr.sourceReference("itemNames/externalStorage", "slots.id")},
				React.createElement(Wprr.layout.items.LoadAdditionalItems, {ids: idSource},
					Wprr.text(Wprr.sourceFunction(ItemName, ItemName.getItemName, [idSource, aSlots.prop("items", Wprr.sourceReference("items")), aSlots.prop("namePath", "data.title")]))
				)
			),
			React.createElement(Wprr.HasData, {check: idSource, checkType: "invert/default", sourceUpdates: Wprr.sourceReference("itemNames/externalStorage", "slots.id")},
				Wprr.idText("No item", "noItem")
			),
		);
	}
	
	static getItemName(aId, aItems, aNamePath = "data.title") {
		//console.log("ItemName::getItemName");
		//console.log(aId);
		
		let item = aItems.getItem(aId);
		
		let name = Wprr.objectPath(item, aNamePath);
		
		return name;
	}
}
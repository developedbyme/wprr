"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "./Layout";

// import ItemList from "./ItemList";
export default class ItemList extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ItemList::constructor");

		super();
		
		this._layoutName = "itemList";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "list"},
			React.createElement(Wprr.Loop,
				{
					loop: Wprr.adjusts.markupLoop(
						aSlots.prop("ids", []),
						aSlots.source("itemInjection",
							React.createElement(Wprr.SelectItem, {id: Wprr.sourceReference("loop/item")},
								aSlots.default(
									React.createElement("div", null, "No list item set")
								)
							)
						),
						aSlots.source("spacing", null)).setInput("keyField", []),
					sourceUpdates: Wprr.sourceReference("itemList/externalStorage", "slots.ids")
				},
				aSlots.slot("insertElements",
					React.createElement(Wprr.InjectChildren, null)
				)
			)
		);
	}
}
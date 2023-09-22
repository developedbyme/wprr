"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

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
		
		return React.createElement(Wprr.BaseObject, {className: "list", overrideMainElementType: aSlots.prop("listElementType", null)},
			aSlots.slot("loopElement",
				React.createElement(Wprr.Loop,
					{
						loop: Wprr.adjusts.markupLoop(
							Wprr.sourceFunction(Wprr.utils.array, "singleOrArray", [aSlots.prop("ids", [])]),
							aSlots.source("itemInjection",
								React.createElement(Wprr.IgnoreUpdates, {}, 
									React.createElement(Wprr.SelectItem, {id: Wprr.sourceReference("loop/item"), as: aSlots.prop("as", "item")},
										aSlots.default(
											React.createElement("div", null, "No list item set")
										)
									)
								)
							),
							aSlots.source("spacing", null)
						).setInput("keyField", []),
						sourceUpdates: Wprr.sourceReference("itemList/externalStorage", "slots.ids")
					},
					aSlots.slot("insertElements",
						React.createElement(Wprr.InjectChildren, null)
					)
				)
			)
		);
	}
}
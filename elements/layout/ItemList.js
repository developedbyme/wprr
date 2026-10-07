import React from "react";
import Wprr from "wprr/Wprr";
import Dbm from "dbm";

import Layout from "./Layout";

export default class ItemList extends Layout {

	_construct() {

		super._construct();
		
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
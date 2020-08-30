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
		
		return <div className="list">
			<Wprr.Loop
				loop={
					Wprr.adjusts.markupLoop(
						aSlots.prop("ids", []),
						aSlots.source("itemInjection", <Wprr.SelectItem id={Wprr.sourceReference("loop/item")}>
							{aSlots.default(<div>No list item set</div>)}
						</Wprr.SelectItem>),
						aSlots.source("spacing", null)
					).setInput("keyField", [])
				}
				sourceUpdates={Wprr.sourceReference("itemList/externalStorage", "slots.ids")}
			>
				{aSlots.slot("insertElements", <Wprr.InjectChildren />)}
			</Wprr.Loop>
		</div>;
	}
}
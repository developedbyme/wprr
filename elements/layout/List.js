"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "./Layout";

// import List from "./List";
export default class List extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("List::constructor");

		super();
		
		this._layoutName = "itemList";
	}
	
	_getLayout(aSlots) {
		
		return <div className="list">
			<Wprr.Loop
				loop={
					Wprr.adjusts.markupLoop(
						aSlots.prop("items", []),
						aSlots.source("defaultSlot", <div>No list item set</div>),
						aSlots.source("spacing", null)
					).setInput("keyField", [])
				}
			>
				{aSlots.slot("insertElements", <Wprr.InjectChildren />)}
			</Wprr.Loop>
		</div>;
	}
}
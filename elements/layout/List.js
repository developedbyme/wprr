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
		
		return React.createElement("div", {className: "list"},
			React.createElement(Wprr.Loop, {loop: Wprr.adjusts.markupLoop(
				aSlots.prop("items", []),
				aSlots.source("defaultSlot", React.createElement("div", null, "No list item set")),
				aSlots.source("spacing", null)
			).setInput("keyField", [])},
				aSlots.slot("insertElements", React.createElement(Wprr.InjectChildren, null))
			)
		);
	}
}
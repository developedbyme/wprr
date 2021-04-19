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
		
		this._layoutName = "list";
	}
	
	_getLayout(aSlots) {
		
		let itemsProp = aSlots.prop("items", []);
		let keyField = aSlots.prop("keyField", []);
		
		let afterListProp = aSlots.prop("afterList", null);
		
		return React.createElement("div", {className: "list"},
			React.createElement(Wprr.Loop, {loop: Wprr.adjusts.markupLoop(
				itemsProp,
				aSlots.source("defaultSlot", React.createElement("div", null, "No list item set")),
				aSlots.source("spacing", null)
			).setInput("keyField", keyField), "sourceUpdates": [itemsProp, keyField]},
				aSlots.slot("insertElements", React.createElement(Wprr.InjectChildren, null))
			),
			React.createElement(Wprr.HasData, {check: afterListProp},
				aSlots.useSlot("afterList")
			)
		);
	}
}
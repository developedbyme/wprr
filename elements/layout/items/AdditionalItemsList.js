"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import AdditionalItemsList from "./AdditionalItemsList";
export default class AdditionalItemsList extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("AdditionalItemsList::constructor");

		super();
		
		this._layoutName = "additionalItemsList";

	}
	
	_getLayout(aSlots) {
		
		let idSource = aSlots.prop("ids", []);
		
		return React.createElement(Wprr.layout.items.LoadAdditionalItems, {"ids": idSource},
			React.createElement(Wprr.layout.ItemList, {"ids": idSource},
				aSlots.default(React.createElement("div", {}, "No element set"))
			)
		);
	}
	
	static createFromRelation(aDirection, aConnectionType, aObjectType, aElement) {
		
		let pointerName = (aDirection === "outgoing") ? "to" : "from";
		let idSource = Wprr.sourceReference("item", "multipleRelations." + aDirection + "." + aConnectionType + "." + aObjectType + ".(every)." + pointerName + ".id");
		
		return React.createElement(AdditionalItemsList, {"ids": idSource},
			aElement
		);
	}
}
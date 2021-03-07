"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import CartCount from "./CartCount";
export default class CartCount extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("CartCount::constructor");

		super();
		
		this._layoutName = "cartCount";
	}
	
	_getCount(aCart, aCountType = "quantity") {
		console.log("_getCount");
		console.log(aCart);
		
		let items = Wprr.objectPath(aCart, "items");
		
		if(aCountType === "items") {
			return Wprr.objectPath(items, "length");
		}
		
		let quantities = Wprr.utils.array.mapField(items, "quantity");
		
		return Wprr.utils.array.sum(quantities);
	}
	
	_getLayout(aSlots) {
		
		let countType = aSlots.prop("countType", "quantity");
		
		return React.createElement("div", {},
			aSlots.slot("loader",
				React.createElement(Wprr.DataLoader, {"loadData": {"cart": Wprr.utils.wprrUrl.getCartUrl()}},
					React.createElement(Wprr.AddReference, {"data": Wprr.sourceFunction(this, this._getCount, [Wprr.sourceProp("cart"), countType]), "as": "cartCount"},
						React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("cartCount")},
							React.createElement("div", {className: "cart-count cart-count-padding"},
								aSlots.slot("cartNumber",
									React.createElement("div", {className: "centered-cell-holder full-size"},
										React.createElement("div", {className: "cart-count-number"},
											Wprr.text(Wprr.sourceReference("cartCount"))
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
}
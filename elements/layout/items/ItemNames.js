"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import ItemNames from "./ItemNames";
export default class ItemNames extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ItemNames::constructor");

		super();
		
		this._layoutName = "itemNames";
	}
	
	_getLayout(aSlots) {
		
		return <span className="items-names">
			<Wprr.Adjust
				adjust={[
					Wprr.adjusts.startOfArrayAsText(
						Wprr.sourceFunction(
							ItemNames, ItemNames.getItemNames, [
								aSlots.prop("ids", []),
								aSlots.prop("items", Wprr.sourceReference("items")),
								aSlots.prop("namePath", "data.title")
							]
						)
					)
				]}
				sourceUpdates={Wprr.sourceReference("itemNames/externalStorage", "slot.ids")}
			>
				{Wprr.text(null)}
			</Wprr.Adjust>
		</span>;
	}
	
	static getItemNames(aIds, aItems, aNamePath = "data.title") {
		console.log("ItemNames::getItemNames");
		console.log(aIds);
		
		let items = aItems.getItems(aIds);
		return Wprr.utils.array.mapField(items, aNamePath);
	}
}
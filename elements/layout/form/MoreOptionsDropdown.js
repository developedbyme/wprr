"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import MoreOptionsDropdown from "./MoreOptionsDropdown";
export default class MoreOptionsDropdown extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("MoreOptionsDropdown::constructor");

		super();
		
		this._layoutName = "moreOptionsDropdown";
	}
	
	_getLayout(aSlots) {
		
		
		return React.createElement("div",
			{
				className: "more-options-dropdown"
			},
			Wprr.DropdownSelection.createSelfContained(
				aSlots.slot("button",
					React.createElement(Wprr.Image,
						{
							className: aSlots.prop("iconClasses", "icon standard-icon background-contain cursor-pointer"),
							src: aSlots.prop("iconPath", "icons/more.svg")
						}
					)
				),
				aSlots.slot("overlay", React.createElement("div",
					{
						className: "custom-selection-menu"
					},
					aSlots.default(React.createElement("div", {}, "No content set")
				))),
				{
					"className": aSlots.prop("containerClassName", "custom-dropdown dropdown-from-right")
				}
			)
		);
	}
}
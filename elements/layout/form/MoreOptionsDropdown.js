"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class MoreOptionsDropdown extends Layout {


	_construct() {

		super._construct();
		
		this._layoutName = "moreOptionsDropdown";
	}
	
	_getLayout(aSlots) {
		
		
		return React.createElement("div", {className: "more-options-dropdown"},
			Wprr.DropdownSelection.createSelfContained(
				aSlots.slot("button",
					React.createElement(Wprr.Image, {className: aSlots.prop("iconClasses", "icon standard-icon background-contain cursor-pointer"), src: aSlots.prop("iconPath", "icons/more.svg"), "location": "images"})
				),
				aSlots.slot("overlay", React.createElement("div", {className: "custom-selection-menu"},
					aSlots.default(React.createElement("div", {}, "No content set")
				))),
				{"className": aSlots.prop("containerClassName", "custom-dropdown dropdown-from-right")}
			)
		);
	}
}
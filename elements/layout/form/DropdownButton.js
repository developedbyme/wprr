"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import DropdownButton from "./DropdownButton";
export default class DropdownButton extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("DropdownButton::constructor");

		super();
		
		this._layoutName = "dropdownButton";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div",
			{
				className: "dropdown-button standard-dropdown-button standard-dropdown-button-padding"
			},
			React.createElement(Wprr.FlexRow,
				{
					className: "justify-between vertically-center-items",
					itemClasses: "flex-no-resize flex-resize"
				},
				aSlots.default(Wprr.text(aSlots.prop("text", Wprr.sourceTranslation("Select")))),
				aSlots.slot("arrow", React.createElement(Wprr.Image, {
					className: "background-contain dropdown-arrow",
					src: aSlots.prop("arrowSrc", "arrow-down.svg")
				}))
			)
		);
	}
}
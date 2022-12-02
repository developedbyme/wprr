"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import Button from "./Button";
export default class Button extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("Button::constructor");

		super();
		
		this._layoutName = "button";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement(Wprr.CommandButton,
			{
				commands: aSlots.prop("commands", null)
			},
			aSlots.slot("buttonElement", 
				React.createElement(Wprr.BaseObject,
					{
						className: aSlots.prop("buttonClasses", "standard-button standard-button-hover standard-button-padding"),
					},
					aSlots.default(Wprr.text(aSlots.prop("text", Wprr.sourceTranslation("Click"))))
				)
			)
		);
	}
}
"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import Button from "./Overlay";
export default class Overlay extends Layout {

	/**
	 * Constructor
	 */
	_construct() {
		//console.log("Overlay::constructor");

		super._construct();
		
		this._layoutName = "overlay";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "position-absolute full-width"},
			React.createElement(Wprr.PortalledItem, {"overlayClassName": "layer-order-portal"},
				React.createElement(Wprr.ClickOutsideTrigger, {"commands": aSlots.prop("clickOutsideCommands", [])},
					React.createElement(Wprr.OpenCloseExpandableArea, {"open": aSlots.prop("open", [])},
						aSlots.default()
					)
				)
			)
		);
	}
}
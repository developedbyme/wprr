"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import Button from "./CornerPositions";
export default class CornerPositions extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("CornerPositions::constructor");

		super();
		
		this._layoutName = "cornerPositions";
	}
	
	_getLayout(aSlots) {
		
		let topLeft = aSlots.slot("topLeft", null);
		let topRight = aSlots.slot("topRight", null);
		let bottomRight = aSlots.slot("bottomRight", null);
		let bottomLeft = aSlots.slot("bottomLeft", null);
		
		return React.createElement("div", {className: "absolute-container"},
			React.createElement(Wprr.HasData, {check: aSlots.useProp("topLeft")},
				React.createElement("div", {className: "position-absolute top-left"}, topLeft)
			),
			React.createElement(Wprr.HasData, {check: aSlots.useProp("topRight")},
				React.createElement("div", {className: "position-absolute top-right"}, topRight)
			),
			React.createElement(Wprr.HasData, {check: aSlots.useProp("bottomRight")},
				React.createElement("div", {className: "position-absolute bottom-right"}, bottomRight)
			),
			React.createElement(Wprr.HasData, {check: aSlots.useProp("bottomLeft")},
				React.createElement("div", {className: "position-absolute bottom-left"}, bottomLeft)
			),
		);
	}
}
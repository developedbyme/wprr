import React from "react";
import Wprr from "wprr";

import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

//import CheckmarkCircle from "./CheckmarkCircle";
export default class CheckmarkCircle extends Layout {

	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "checkmarkCircle";
	}
	
	_getLayout(aSlots) {
		//console.log("CheckmarkCircle::_renderMainElement");
		
		return React.createElement(Wprr.Adjust, {adjust: Wprr.adjusts.classFromComparison(aSlots.prop("active", false), true, "===", "active"), sourceUpdates: Wprr.sourceReference("checkmarkCircle/externalStorage", "slots.active")},
			React.createElement("div", {className: "checkmark-circle checkmark-circle-padding"},
				React.createElement(Wprr.HasData, {check: aSlots.useProp("active"), sourceUpdates: Wprr.sourceReference("checkmarkCircle/externalStorage", "slots.active")},
					React.createElement(Wprr.Image, {className: "background-contain icon full-size", src: "checkmark-bold-white.svg"})
				)
			)
		);
	}
}

"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class LabelledArea extends Layout {

	_construct() {

		super._construct();
		
		this._layoutName = "labelledArea";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "field-with-label"},
			aSlots.slot("labelElement",
				React.createElement(Wprr.BaseObject, {overrideMainElement: "label", className: aSlots.prop("labelClassName", "standard-field-label")},
					aSlots.slot("labelContent",
						Wprr.text(aSlots.prop("label", "Label not set"))
					)
				)
			),
			aSlots.slot("spacing",
				React.createElement("div", {className: "spacing small field-label-spacing"})
			),
			aSlots.default(React.createElement("div", {}, "No element set"))
		);
	}
}
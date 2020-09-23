"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import FieldWithLabel from "./FieldWithLabel";
export default class FieldWithLabel extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("FieldWithLabel::constructor");

		super();
		
		this._layoutName = "fieldWithLabel";
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
			aSlots.slot("edtiablePropsElement",
				React.createElement(Wprr.EditableProps, {"props": aSlots.useProp("valueName"), "externalStorage": aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"))},
					aSlots.default(
						React.createElement(Wprr.FormField, {
							type: aSlots.prop("fieldType", "text"),
							className: aSlots.prop("fieldClassName", "standard-field standard-field-padding full-width"),
							"valueName": aSlots.prop("valueName", "value"),
						})
					)
				)
			)
		);
	}
}
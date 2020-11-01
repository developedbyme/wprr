"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import SteppedNumber from "./SteppedNumber";
export default class SteppedNumber extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SteppedNumber::constructor");
		
		super();
		
		this._layoutName = "steppedNumber";
	}
	
	_getLayout(aSlots) {
		
		let valueNameProp = aSlots.prop("valueName", "value");
		let externalStorageSource = aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"));
		let minValue = aSlots.prop("minValue", null);
		let maxValue = aSlots.prop("maxValue", null);
		
		return React.createElement("div", {className: "stepped-number"},
			React.createElement(Wprr.FlexRow, {"className": "small-item-spacing vertically-center-items"},
				Wprr.CommandButton.create(
					Wprr.commands.stepValue(externalStorageSource, valueNameProp, externalStorageSource.deeper(valueNameProp), -1).setInput("minValue", minValue).setInput("maxValue", maxValue),
					React.createElement(Wprr.Image, {"className": "standard-icon background-contain", "src": "subtract-circle.svg"})
				),
				aSlots.slot("edtiablePropsElement",
					React.createElement(Wprr.EditableProps, {"props": valueNameProp, "externalStorage": externalStorageSource},
						aSlots.default(
							React.createElement(Wprr.FormField, {
								"type": aSlots.prop("fieldType", "number"),
								"className": aSlots.prop("fieldClassName", "standard-field number-field standard-field-padding"),
								"valueName": valueNameProp
							})
						)
					)
				),
				Wprr.CommandButton.create(
					Wprr.commands.stepValue(externalStorageSource, valueNameProp, externalStorageSource.deeper(valueNameProp), 1).setInput("minValue", minValue).setInput("maxValue", maxValue),
					React.createElement(Wprr.Image, {"className": "standard-icon background-contain", "src": "add-circle.svg"})
				)
			)
		);
	}
}
"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import ValidationErrorPopup from "./ValidationErrorPopup";
export default class ValidationErrorPopup extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ValidationErrorPopup::constructor");

		super();
		
		this._layoutName = "validationErrorPopup";
	}
	
	_shouldShow(aStatus) {
		console.log("ValidationErrorPopup::_shouldShow");
		if(aStatus === "invalid") {
			return true;
		}
		
		return false;
	}
	
	_getLayout(aSlots) {
		
		
		return React.createElement("div", {className: "validation-error-popup-holder absolute-container"},
			React.createElement("div", {className: "position-absolute validation-error-popup-centered-over-position"},
				React.createElement(Wprr.OpenCloseExpandableArea, {open: Wprr.sourceFunction(this, this._shouldShow, [
					aSlots.prop("validationStatus", Wprr.sourceReference("validation/externalStorage", "validationStatus"))
				]), sourceUpdates: Wprr.sourceReference("validation/externalStorage", "validationStatus")},
					aSlots.slot("popup", React.createElement("div", {className: "validation-error-popup"},
						aSlots.slot("arrow", React.createElement("div", {className: "down-arrow"})),
						aSlots.default("Error message")
					))
				)
			)
		);
	}
}
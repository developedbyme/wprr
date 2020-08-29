"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import MultiStepDropdown from "./MultiStepDropdown";
export default class MultiStepDropdown extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("MultiStepDropdown::constructor");

		super();
		
		this._layoutName = "multiStepDropdown";
	}
	
	_getLayout(aSlots) {
		
		return <div className="multi-step-dropdown">
			
		</div>;
	}
}
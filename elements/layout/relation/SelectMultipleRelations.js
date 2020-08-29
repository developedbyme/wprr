"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import SelectMultipleRelations from "./SelectMultipleRelations";
export default class SelectMultipleRelations extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectMultipleRelations::constructor");

		super();
		
		this._layoutName = "selectMultipleRelations";
	}
	
	_getLayout(aSlots) {
		
		return <div className="select-multiple-relations">
			
		</div>;
	}
}
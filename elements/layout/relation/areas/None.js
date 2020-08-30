"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import None from "./None";
export default class None extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("None::constructor");

		super();
		
		this._layoutName = "none";
	}
	
	_getLayout(aSlots) {
		
		return <div className="none">
			{Wprr.translateText("No areas for current type")}
		</div>;
	}
}
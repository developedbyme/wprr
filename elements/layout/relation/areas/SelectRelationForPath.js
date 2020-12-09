"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import SelectRelation from "./SelectRelation";

// import SelectRelationForPath from "./SelectRelationForPath";
export default class SelectRelationForPath extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectRelationForPath::constructor");

		super();
		
		this._layoutName = "selectRelationForType";
	}
	
	_getLayout(aSlots) {
		
		let relationPath = aSlots.prop("relationPath", Wprr.sourceReference("pathRouter/externalStorage", "data.relationPath"));
		
		let editor = Wprr.sourceReference("item", Wprr.sourceCombine("relationEditors.", relationPath));
		
		return React.createElement(SelectRelation, {editor: editor});
	}
}
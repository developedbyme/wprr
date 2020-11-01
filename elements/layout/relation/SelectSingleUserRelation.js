"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import SelectSingleUserRelation from "./SelectSingleUserRelation";
export default class SelectSingleUserRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectSingleUserRelation::constructor");

		super();
		
		this._layoutName = "selectSingleUserRelation";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		let activeId = activeIds.deeper("0");
		let toIdSource = editorSource.deeper("item.group").deeper(activeId).deeper("userId");
		
		let rangePath = aSlots.prop("rangePath", Wprr.sourceCombine("wprr/v1/users/default/default"));
		
		let skipNoSelection = aSlots.prop("skipNoSelection", false);
		
		return React.createElement("div", {className: "select-single-user-relation"},
			React.createElement(Wprr.RangeSelection, {range: rangePath, skipNoSelection: skipNoSelection, "labelField": "name"},
				aSlots.default(
					React.createElement(Wprr.Selection, {selection: toIdSource, changeCommands: Wprr.commands.callFunction(editorSource, "replaceWith", [Wprr.source("event", "raw")]), sourceUpdates: activeIds})
				)
			)
		);
	}
}
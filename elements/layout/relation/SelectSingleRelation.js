"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import SelectSingleRelation from "./SelectSingleRelation";
export default class SelectSingleRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectSingleRelation::constructor");

		super();
		
		this._layoutName = "selectSingleRelation";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		let activeId = activeIds.deeper("0");
		
		let directionNameSource = Wprr.sourceFirst(aSlots.prop("direction", null), editorSource.deeper("directionIdName"), Wprr.sourceStatic("to"));
		
		let toIdSource = editorSource.deeper("item.group").deeper(activeId).deeper(directionNameSource).deeper("id");
		
		let dataType = aSlots.prop("dataType", "dbm_data");
		let includedStatuses = aSlots.prop("includedStatuses", "draftsIfAllowed,privates");
		let objectType = Wprr.sourceFirst(aSlots.prop("objectType", null), editorSource.deeper("objectType"));
		let rangePath = Wprr.sourceFirst(aSlots.prop("rangePath", null), Wprr.sourceCombine("wprr/v1/range/", dataType, "/", includedStatuses, ",relation/status,privateTitle?type=", objectType));
		
		let skipNoSelection = aSlots.prop("skipNoSelection", false);
		
		return React.createElement("div", {className: "select-single-relation"},
			React.createElement(Wprr.RangeSelection, {range: rangePath, skipNoSelection: skipNoSelection},
				aSlots.default(
					React.createElement(Wprr.Selection, {selection: toIdSource, changeCommands: Wprr.commands.callFunction(editorSource, "replaceWith", [Wprr.source("event", "raw")]), sourceUpdates: activeIds})
				)
			)
		);
	}
}
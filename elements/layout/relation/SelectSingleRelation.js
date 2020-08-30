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
		let toIdSource = editorSource.deeper("item.group").deeper(activeId).deeper(aSlots.prop("direction", "to")).deeper("id");
		
		let dataType = aSlots.prop("dataType", "dbm_data");
		let includedStatuses = aSlots.prop("includedStatuses", "drafts,privates");
		let objectType = aSlots.prop("objectType", editorSource.deeper("objectType"));
		let rangePath = aSlots.prop("rangePath", Wprr.sourceCombine("wprr/v1/range/", dataType, "/", includedStatuses, ",relation/status,privateTitle?type=", objectType));
		
		return <div className="select-single-relation">
			<Wprr.RangeSelection
				range={rangePath}
			>
				{aSlots.default(
					<Wprr.Selection
						selection={toIdSource}
						changeCommands={Wprr.commands.callFunction(editorSource, "replaceWith", [Wprr.source("event", "raw")])}
						sourceUpdates={activeIds}
					/>
				)}
			</Wprr.RangeSelection>
		</div>;
	}
}
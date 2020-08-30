"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import AddRelation from "./AddRelation";
export default class AddRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("AddRelation::constructor");

		super();
		
		this._layoutName = "addRelation";
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
		
		
		let loopItem = <Wprr.CommandButton commands={[
			Wprr.commands.callFunction(editorSource, "add", [Wprr.sourceReference("loop/item", "value")]),
			Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceReference("pathRouter/externalStorage").deeper("path")]))
		]}>
			<div>
				{Wprr.text(Wprr.sourceReference("loop/item", "label"))}
			</div>
		</Wprr.CommandButton>;
		
		return <div className="add-relation">
			<Wprr.ExternalStorageProps props="path" externalStorage={Wprr.sourceReference("pathRouter/externalStorage")}>
				<Wprr.HasData check={Wprr.sourceProp("path")} checkType="notEmpty">
					<Wprr.CommandButton commands={Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceProp("path")]))}>
						<div className="multi-step-dropdown-navigation-bar multi-step-dropdown-navigation-bar-padding cursor-pointer">&lt; {Wprr.translateText("Back")}</div>
					</Wprr.CommandButton>
				</Wprr.HasData>
			</Wprr.ExternalStorageProps>
			<div className="custom-selection-menu-padding content-text-small">
				<Wprr.RangeSelection
					range={rangePath}
					skipNoSelection={true}
				>
					{Wprr.Loop.createMarkupLoop(Wprr.sourceProp("options"), loopItem)}
				</Wprr.RangeSelection>
			</div>
		</div>;
	}
	
	_getLevelUpPath(aPath) {
		let pathArray = aPath.split("/");
		
		pathArray.pop();
		
		return pathArray.join("/")
	}
}
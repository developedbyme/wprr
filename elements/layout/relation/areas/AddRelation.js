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
		
		let editorSource = Wprr.sourceFirst(aSlots.prop("editor", null), Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let dataType = aSlots.prop("dataType", "dbm_data");
		let includedStatuses = aSlots.prop("includedStatuses", "drafts,privates");
		let objectType = Wprr.sourceFirst(aSlots.prop("objectType", null), editorSource.deeper("objectType"));
		let rangePath = Wprr.sourceFirst(aSlots.prop("rangePath", null), Wprr.sourceCombine("wprr/v1/range/", dataType, "/", includedStatuses, ",relation/status,privateTitle?type=", objectType));
		
		
		let loopItem = React.createElement(Wprr.CommandButton, {commands: [
			Wprr.commands.callFunction(editorSource, "add", [Wprr.sourceReference("loop/item", "value")]),
			Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceReference("pathRouter/externalStorage").deeper("path")]))
		]},
			React.createElement(Wprr.BaseObject, {"className": aSlots.prop("rowClassName", "hover-row cursor-pointer")},
				Wprr.text(Wprr.sourceReference("loop/item", "label"))
			)
		);
		
		return React.createElement("div", {className: "add-relation"},
			React.createElement(Wprr.HasData, {check: Wprr.sourceReference("pathRouter/externalStorage", "path"), checkType: "notEmpty"},
				React.createElement(Wprr.CommandButton, {commands: Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceProp("path")]))},
					React.createElement("div", {className: "multi-step-dropdown-navigation-bar multi-step-dropdown-navigation-bar-padding cursor-pointer"},
						"< ",
						Wprr.idText("Back", "back")
					)
				)
			),
			React.createElement("div", {className: "custom-selection-menu-padding content-text-small"},
				React.createElement(Wprr.RangeSelection, {range: rangePath, skipNoSelection: true},
					Wprr.Loop.createMarkupLoop(Wprr.sourceProp("options"), loopItem)
				)
			)
		);
	}
	
	_getLevelUpPath(aPath) {
		let pathArray = aPath.split("/");
		
		pathArray.pop();
		
		return pathArray.join("/")
	}
}
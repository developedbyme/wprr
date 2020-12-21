"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import SelectRelation from "./SelectRelation";
export default class SelectRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectRelation::constructor");

		super();
		
		this._layoutName = "selectRelation";
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
			Wprr.commands.callFunction(editorSource, "replaceWith", [Wprr.sourceReference("loop/item", "value")]),
			Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceReference("pathRouter/externalStorage").deeper("path")]))
		]},
			React.createElement(Wprr.BaseObject, {"className": aSlots.prop("rowClassName", "hover-row cursor-pointer")},
				Wprr.text(Wprr.sourceReference("loop/item", "label"))
			)
		);
		
		return React.createElement("div", {className: "select-relation"},
			React.createElement(Wprr.ExternalStorageProps, {props: "path", externalStorage: Wprr.sourceReference("pathRouter/externalStorage")},
				React.createElement(Wprr.HasData, {check: Wprr.sourceProp("path"), checkType: "notEmpty"},
					React.createElement(Wprr.CommandButton, {commands: Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceProp("path")]))},
						React.createElement("div", {className: "multi-step-dropdown-navigation-bar multi-step-dropdown-navigation-bar-padding cursor-pointer"},
							"< ",
							Wprr.idText("Back", "back")
						)
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
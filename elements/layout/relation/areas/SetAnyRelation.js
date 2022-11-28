"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import SetAnyRelation from "./SetAnyRelation";
export default class SetAnyRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SetAnyRelation::constructor");

		super();
		
		this._layoutName = "setAnyRelation";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let dataType = aSlots.prop("dataType", "dbm_data");
		let includedStatuses = aSlots.prop("includedStatuses", "drafts,privates");
		let objectType = aSlots.prop("objectType", editorSource.deeper("objectType"));
		let pathSources = Wprr.sourceReference("pathRouter/externalStorage", "path");
		
		let loopItem = React.createElement(Wprr.CommandButton, {commands: [
			Wprr.commands.callFunction(editorSource, "replaceWith", [Wprr.sourceReference("loop/item", "value")]),
			Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", ""),
			Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)
		]},
			React.createElement(Wprr.BaseObject, {"className": aSlots.prop("rowClassName", "hover-row cursor-pointer")},
				Wprr.text(Wprr.sourceReference("loop/item", "label"))
			)
		);
		
		return React.createElement("div", {className: "set-any-relation"},
			React.createElement(Wprr.ExternalStorageProps, {props: "path", externalStorage: Wprr.sourceReference("pathRouter/externalStorage")},
				React.createElement(Wprr.HasData, {check: Wprr.sourceProp("path"), checkType: "notEmpty"},
					React.createElement(Wprr.CommandButton, {commands: Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceFunction(this, this._getLevelUpPath, [Wprr.sourceProp("path")]))},
						React.createElement("div", {className: "multi-step-dropdown-navigation-bar multi-step-dropdown-navigation-bar-padding cursor-pointer"},
							"< ",
							Wprr.translateText("Back")
						)
					)
				)
			),
			React.createElement("div", {className: "custom-selection-menu-padding content-text-small"},
				React.createElement(Wprr.RangeSelection, {range: Wprr.sourceFunction(this, this._getRangePath, [pathSources, includedStatuses]), skipNoSelection: true},
					Wprr.Loop.createMarkupLoop(Wprr.sourceProp("options"), loopItem)
				)
			)
		);
	}
	
	_getRangePath(aRouterPath, aIncludedSources) {
		
		let tempArray = aRouterPath.split("/");
		
		let objectType = tempArray.pop();
		let dataType = tempArray.pop();
		
		let path = "wprr/v1/range/" + dataType + "/" + aIncludedSources;
		let queryString = null;
		if(objectType && objectType !== "any") {
			path += ",relation";
			queryString = "?type=" + objectType;
		}
		
		path += "/status,privateTitle";
		if(queryString) {
			path += queryString;
		}
		
		//console.log("path>", path);
		
		return path;
		
	}
	
	_getLevelUpPath(aPath) {
		let pathArray = aPath.split("/");
		
		pathArray.pop();
		
		return pathArray.join("/")
	}
}
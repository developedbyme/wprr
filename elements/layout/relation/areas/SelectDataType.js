"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import SelectDataType from "./SelectDataType";
export default class SelectDataType extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectDataType::constructor");

		super();
		
		this._layoutName = "selectDataType";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let loopItem = React.createElement(Wprr.CommandButton, {commands: [
			Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceCombine(Wprr.sourceReference("pathRouter/externalStorage", "path"), "/", Wprr.sourceReference("loop/item", "value")))
		]},
			React.createElement(Wprr.BaseObject, {"className": aSlots.prop("rowClassName", "hover-row cursor-pointer")},
				Wprr.text(Wprr.sourceReference("loop/item", "label"))
			)
		);
		
		return React.createElement("div", {className: "select-data-type"},
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
				React.createElement(Wprr.TermSelection, {taxonomy: "dbm_type", skipNoSelection: true, valueField: "slug"},
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
"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import SelectPostType from "./SelectPostType";
export default class SelectPostType extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectPostType::constructor");

		super();
		
		this._layoutName = "selectPostType";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let postTypes = {
			"post": "Posts",
			"page": "Pages",
			"dbm_area": "Areas",
			"dbm_additional": "Additional pages",
			"dbm_data": "Data",
			"any": "Any"
		};
		
		let options = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(postTypes);
		
		let loopItem = React.createElement(Wprr.CommandButton, {commands: [
			Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", Wprr.sourceCombine(Wprr.sourceReference("pathRouter/externalStorage", "path"), "/", Wprr.sourceReference("loop/item", "key")))
		]},
			React.createElement(Wprr.BaseObject, {"className": aSlots.prop("rowClassName", "hover-row cursor-pointer")},
				Wprr.text(Wprr.sourceReference("loop/item", "label"))
			)
		);
		
		return React.createElement("div", {className: "add-relation"},
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
				Wprr.Loop.createMarkupLoop(options, loopItem)
			)
		);
	}
	
	_getLevelUpPath(aPath) {
		let pathArray = aPath.split("/");
		
		pathArray.pop();
		
		return pathArray.join("/")
	}
}
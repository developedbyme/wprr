"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import * as areas from "./areas/areas.js";

// import SelectMultipleRelations from "./SelectMultipleRelations";
export default class SelectMultipleRelations extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectMultipleRelations::constructor");

		super();
		
		this._layoutName = "selectMultipleRelations";
	}
	
	_getRoutes() {
		return [
			{"test": ".*", "type": "manageExistingRelations", "data": {}, "children": [
				{"test": "add", "type": "addRelation", "data": {}, "children": []},
			]}
		];
	}
	
	_getLayout(aSlots) {
		
		let editorSource = Wprr.sourceFirst(aSlots.prop("editor", null), Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		let idSource = Wprr.sourceCombine(editorSource.deeper("directionIdName"), ".id");
		
		let routes = this._getRoutes();
		
		return React.createElement("div", {className: "select-multiple-relations"},
			React.createElement(Wprr.layout.form.MultiStepDropdown, {routes: routes, areaClasses: areas},
				React.createElement(Wprr.layout.items.LoadAdditionalItems, {ids: Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [activeIds, idSource]), "data-slot": "buttonContent", sourceUpdates: activeIds},
					React.createElement(Wprr.layout.items.ItemNames, {ids: Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [activeIds, idSource]), sourceUpdates: activeIds})
				)
			)
		);
	}
}
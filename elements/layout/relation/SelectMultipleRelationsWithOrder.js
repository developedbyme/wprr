"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import * as areas from "./areas/areas.js";

// import SelectMultipleRelationsWithOrder from "./SelectMultipleRelationsWithOrder";
export default class SelectMultipleRelationsWithOrder extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectMultipleRelationsWithOrder::constructor");

		super();
		
		this._layoutName = "selectMultipleRelationsWithOrder";
	}
	
	_getRoutes() {
		return [
			{"test": ".*", "type": "manageExistingRelationsWithOrder", "data": {}, "children": [
				{"test": "add", "type": "addRelation", "data": {}, "children": []},
			]}
		];
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		
		let orderId = aSlots.prop("orderId", "none");
		
		let routes = this._getRoutes();
		
		//METODO: get direction from editor
		
		return React.createElement("div", {className: "select-multiple-relations"},
			React.createElement(Wprr.AddReference, {data: orderId, as: "orderId"}, 
				React.createElement(Wprr.layout.form.MultiStepDropdown, {routes: routes, areaClasses: areas},
					React.createElement(Wprr.layout.items.ItemNames, {ids: Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [activeIds, "to.id"]), "data-slot": "buttonContent", sourceUpdates: activeIds})
				)
			)
		);
	}
}
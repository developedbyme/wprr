"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import * as areas from "./areas/areas.js";

// import SelectRelationOfAnyType from "./SelectRelationOfAnyType";
export default class SelectRelationOfAnyType extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SelectRelationOfAnyType::constructor");

		super();
		
		this._layoutName = "selectMultipleRelations";
	}
	
	_getRoutes() {
		return [
			{"test": ".*", "type": "selectPostType", "data": {}, "children": [
				{"test": "[a-zA-Z0-9\\-_]+.*", "type": "selectDataType", "data": {}, "children": [
					{"test": "[a-zA-Z0-9\\-_]+/.*", "type": "setAnyRelation", "data": {}, "children": [
				
					]}
				]}
			]},
		];
	}
	
	_getLayout(aSlots) {
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		let idSource = Wprr.sourceCombine(editorSource.deeper("directionIdName"), ".id");
		
		let routes = this._getRoutes();
		
		return React.createElement("div", {className: "select-relation-of-any-type"},
			React.createElement(Wprr.layout.form.MultiStepDropdown, {routes: routes, areaClasses: areas},
				React.createElement(Wprr.layout.items.ItemNames, {ids: Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [activeIds, idSource]), "data-slot": "buttonContent", sourceUpdates: activeIds})
			)
		);
	}
}
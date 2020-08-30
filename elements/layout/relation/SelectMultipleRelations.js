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
		
		let editorSource = aSlots.prop("editor", Wprr.sourceReference("editor"));
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		
		let routes = this._getRoutes();
		
		//METODO: get direction from editor
		
		return <div className="select-multiple-relations">
			<Wprr.layout.form.MultiStepDropdown routes={routes} areaClasses={areas}>
				<Wprr.layout.items.ItemNames ids={Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [activeIds, "to.id"])} data-slot="buttonContent" sourceUpdates={activeIds} />
			</Wprr.layout.form.MultiStepDropdown>
		</div>;
	}
}
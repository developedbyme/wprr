"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import ManageExistingRelations from "./ManageExistingRelations";
export default class ManageExistingRelations extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ManageExistingRelations::constructor");

		super();
		
		this._layoutName = "manageExistingRelations";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = Wprr.sourceReference("editor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		
		return React.createElement("div", {
  className: "manage-existing-relations custom-selection-menu-padding content-text-small"
}, React.createElement(Wprr.layout.ItemList, {
  ids: activeIds
}, React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing",
  itemClasses: "flex-resize,flex-no-resize"
}, React.createElement(Wprr.layout.relation.DisplayRelation, null, React.createElement("div", {
  "data-slot": "idCell"
}), React.createElement("div", {
  "data-slot": "arrow"
}), React.createElement("div", {
  "data-slot": "fromCell"
}), React.createElement("div", {
  "data-slot": "startFlagCell"
}), React.createElement("div", {
  "data-slot": "endFlagCell"
})), React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(editorSource, "endRelationNow", [Wprr.sourceReference("item", "id")])]
}, React.createElement("div", {
  className: "edit-button edit-button-padding pointer-cursor"
}, Wprr.translateText("Remove"))))), React.createElement("div", {
  className: "spacing small"
}), React.createElement(Wprr.FlexRow, null, React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", "add")
}, React.createElement("div", {
  className: "edit-button edit-button-padding cursor-pointer"
}, Wprr.translateText("Add")))));
	}
}
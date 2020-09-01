"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import ManageExistingRelationsWithOrder from "./ManageExistingRelationsWithOrder";
export default class ManageExistingRelationsWithOrder extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ManageExistingRelationsWithOrder::constructor");

		super();
		
		this._layoutName = "manageExistingRelationsWithOrder";
		
	}
	
	_getLayout(aSlots) {
		
		let sortChain = Wprr.utils.SortChain.create();
		
		let editorSource = Wprr.sourceReference("editor");
		let orderEditorSource = editorSource.deeper("item.orderEditor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		
		let orderId = aSlots.prop("orderId", Wprr.sourceReference("orderId"));
		let order = orderEditorSource.deeper("externalStorage").deeper(orderId);
		
		sortChain.addAccordingToOrderSort(order);
		
		return 
React.createElement("div", {
  className: "manage-existing-relations custom-selection-menu-padding content-text-small"
}, React.createElement(Wprr.Adjust, {
  adjust: sortChain.getApplyAdjustFunction(activeIds, "sortedIds"),
  sourceUpdates: [activeIds, order]
}, React.createElement(Wprr.BaseObject, {
  didMountCommands: Wprr.commands.callFunction(orderEditorSource, "setOrder", [orderId, Wprr.sourceProp("sortedIds")]),
  didUpdateCommands: Wprr.commands.callFunction(orderEditorSource, "setOrder", [orderId, Wprr.sourceProp("sortedIds")])
}), React.createElement(Wprr.layout.ItemList, {
  ids: Wprr.sourceProp("sortedIds")
}, React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing",
  itemClasses: "flex-resize,flex-no-resize,flex-no-resize,flex-no-resize"
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
  commands: [Wprr.commands.callFunction(orderEditorSource, "moveUp", [orderId, Wprr.sourceReference("item", "id")])]
}, React.createElement("div", {
  className: "edit-button edit-button-padding pointer-cursor"
}, Wprr.translateText("Up"))), React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(orderEditorSource, "moveDown", [orderId, Wprr.sourceReference("item", "id")])]
}, React.createElement("div", {
  className: "edit-button edit-button-padding pointer-cursor"
}, Wprr.translateText("Down"))), React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(editorSource, "endRelationNow", [Wprr.sourceReference("item", "id")])]
}, React.createElement("div", {
  className: "edit-button edit-button-padding pointer-cursor"
}, Wprr.translateText("Remove")))))), React.createElement("div", {
  className: "spacing small"
}), React.createElement(Wprr.FlexRow, null, React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", "add")
}, React.createElement("div", {
  className: "edit-button edit-button-padding cursor-pointer"
}, Wprr.translateText("Add")))));
	}
}
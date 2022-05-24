"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import HierarchyLevelList from "./HierarchyLevelList";
export default class HierarchyLevelList extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("HierarchyLevelList::constructor");

		super();
		
		this._layoutName = "hierarchyLevelList";
		this._hierarchyItem = null;
	}
	
	_getNextIndentLevel(aLevel) {
		return (1*aLevel)+1;
	}
	
	_getIndentStyle(aLevel) {
		return {"width": 40};
	}
	
	_getLayout(aSlots) {
		
		let editorSource = Wprr.sourceReference("editor");
		let orderEditorSource = editorSource.deeper("item.orderEditor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		
		let orderId = aSlots.prop("orderId", Wprr.sourceReference("orderId"));
		let order = orderEditorSource.deeper("externalStorage").deeper(orderId);
		
		let idSource = Wprr.sourceCombine(editorSource.deeper("directionIdName"), ".id");
		
		return React.createElement("div", {className: "hierarchy-level-list"},
			React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceReference("orderHierarchyItem", "children.idsSource")},
				React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("item"), as: "orderHierarchyItem"},
					React.createElement(Wprr.RelatedItem, {"id": "link.linkedItem"},
						React.createElement(Wprr.DraggableItem, {"dragParent": false, "addMode": "insertBefore"},
							React.createElement(Wprr.FlexRow, {className: "micro-item-spacing vertically-center-items flex-no-wrap", itemClasses: "flex-no-resize,flex-resize,flex-no-resize"},
								React.createElement("div", {"draggable": "true"},
									React.createElement(Wprr.Image, {"className": "standard-icon background-contain", "src": "icons/change-order.svg"})
								),
								React.createElement(Wprr.layout.items.LoadAdditionalItems, {ids: Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [Wprr.source("array", [Wprr.sourceReference("item", "id")]), idSource])},
									aSlots.default(React.createElement(Wprr.layout.relation.DisplayRelationDirection, {"directionIdName": editorSource.deeper("directionIdName")},
										React.createElement("div", {"data-slot": "idCell"}),
										React.createElement("div", {"data-slot": "startFlagCell"}),
										React.createElement("div", {"data-slot": "endFlagCell"})
									))
								),
								React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.callFunction(editorSource, "endRelationNow", [Wprr.sourceReference("item", "id")])]},
									React.createElement("div", {className: "edit-button edit-button-padding pointer-cursor"},
										Wprr.translateText("Remove")
									)
								)
							)
						),
						React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(this, this._getNextIndentLevel, [Wprr.sourceReference("hierarchyIndent")]), as: "hierarchyIndent"},
							React.createElement(Wprr.FlexRow, {className: "micro-item-spacing flex-no-wrap", itemClasses: "flex-no-resize,flex-resize"},
								React.createElement(Wprr.BaseObject, {"style": Wprr.sourceFunction(this, this._getIndentStyle, [Wprr.sourceReference("hierarchyIndent")])}),
								React.createElement(Wprr.layout.relation.HierarchyLevelList, {})
							)
						)
					)
				),
				React.createElement("div", {"data-slot": "spacing", "className": "spacing small"})
			),
			React.createElement(Wprr.DraggableItem, {"dragParent": false, "addMode": "append"},
				React.createElement("div", {"className": "append-drop-position", "style": {"marginLeft": 32}})
			)
		);
	}
}
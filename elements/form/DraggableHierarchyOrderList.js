"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import DraggableHierarchyOrderList from "./DraggableHierarchyOrderList";
export default class DraggableHierarchyOrderList extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("DraggableHierarchyOrderList::constructor");

		super();
		
		this._layoutName = "draggableHierarchyOrderList";
	}
	
	_getNextIndentLevel(aLevel) {
		return (1*aLevel)+1;
	}
	
	_getIndentStyle(aLevel) {
		return {"width": 40};
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "hierarchy-level-list"},
			React.createElement(Wprr.layout.ItemList, {"ids": aSlots.prop("items", []), "as": "orderHierarchyItem"},
				React.createElement(Wprr.SelectItem, {"id": Wprr.sourceReference("orderHierarchyItem", "link.id")},
					React.createElement(Wprr.DraggableItem, {"dragParent": false, "addMode": "insertBefore"},
						React.createElement(Wprr.FlexRow, {className: "micro-item-spacing vertically-center-items flex-no-wrap", itemClasses: "flex-no-resize,flex-resize,flex-no-resize"},
							React.createElement("div", {"draggable": "true"},
								React.createElement(Wprr.Image, {"className": "standard-icon background-contain", "src": "icons/change-order.svg"})
							),
							aSlots.default(React.createElement("div", {}, "No element set"))
						)
					),
					React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(this, this._getNextIndentLevel, [Wprr.sourceReference("hierarchyIndent")]), as: "hierarchyIndent"},
						React.createElement(Wprr.FlexRow, {className: "micro-item-spacing flex-no-wrap", itemClasses: "flex-no-resize,flex-resize"},
							React.createElement(Wprr.BaseObject, {"style": Wprr.sourceFunction(this, this._getIndentStyle, [Wprr.sourceReference("hierarchyIndent")])}),
							React.createElement(DraggableHierarchyOrderList, {"items": Wprr.sourceReference("orderHierarchyItem", "children.idsSource")}, aSlots.useSlot("defaultSlot"))
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
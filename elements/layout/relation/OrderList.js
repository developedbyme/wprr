"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import OrderList from "./OrderList";
export default class OrderList extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("OrderList::constructor");

		super();
		
		this._layoutName = "orderList";
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
		
		let idSource = Wprr.sourceCombine(editorSource.deeper("directionIdName"), ".id");
		
		sortChain.addAccordingToOrderSort(order);
		
		return React.createElement("div", {className: "order-list"},
			React.createElement(Wprr.AddReference, {data: orderId, as: "orderId"}, 
				React.createElement(Wprr.layout.items.LoadAdditionalItems, {ids: Wprr.sourceFunction(editorSource.deeper("item.group"), "mapFromIds", [activeIds, idSource]), "data-slot": "buttonContent", sourceUpdates: activeIds},
					React.createElement(Wprr.Adjust, {adjust: sortChain.getApplyAdjustFunction(activeIds, "sortedIds"), sourceUpdates: [activeIds, order]},
						React.createElement(Wprr.BaseObject, {didMountCommands: Wprr.commands.callFunction(orderEditorSource, "setOrder", [orderId, Wprr.sourceProp("sortedIds")])/*, didUpdateCommands: Wprr.commands.callFunction(orderEditorSource, "setOrder", [orderId, Wprr.sourceProp("sortedIds")])*/}),
						React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceProp("sortedIds")},
							React.createElement(Wprr.DraggableOrder, {"data-slot": "insertElements", "order": order, "dragParent": false, "sourceUpdates": [order]}),
							React.createElement(Wprr.FlexRow, {className: "micro-item-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize,flex-no-resize"},
								React.createElement("div", {"draggable": "true"},
									React.createElement(Wprr.Image, {"className": "standard-icon background-contain", "src": "icons/change-order.svg"})
								),
								aSlots.default(React.createElement(Wprr.layout.relation.DisplayRelationDirection, {"directionIdName": editorSource.deeper("directionIdName")},
									React.createElement("div", {"data-slot": "idCell"}),
									React.createElement("div", {"data-slot": "startFlagCell"}),
									React.createElement("div", {"data-slot": "endFlagCell"})
								)),
								React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.callFunction(editorSource, "endRelationNow", [Wprr.sourceReference("item", "id")])]},
									React.createElement("div", {className: "edit-button edit-button-padding pointer-cursor"},
										Wprr.translateText("Remove")
									)
								)
							)
						)
					)
				)
			)
		);
	}
}
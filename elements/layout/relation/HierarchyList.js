"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import HierarchyList from "./HierarchyList";
export default class HierarchyList extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("HierarchyList::constructor");

		super();
		
		this._layoutName = "hierarchyList";
		this._hierarchyItem = null;
		this._movedElement = null;
		
	}
	
	startDrag(aElement) {
		this._movedElement = aElement;
	}
	
	itemDroppedOn(aElement, aData) {
		console.log("itemDroppedOn");
		console.log(aElement, this._movedElement, aData);
		
		if(this._movedElement) {
			let addMode = aElement.getFirstInput("addMode");
		
			if(addMode === "append") {
				let hierarchyItem = this._movedElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
				let atItem = aElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
			
				this._mainHierarchy.moveToParent(hierarchyItem, atItem, -1);
			}
			else if(addMode === "insertBefore") {
				let hierarchyItem = this._movedElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
				let atItem = aElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
			
				let parent = atItem.getType("parent").linkedItem;
			
				let position = parent.getLinks("children").ids.indexOf(atItem.id);
			
				this._mainHierarchy.moveToParent(hierarchyItem, parent, position);
			}
			
			this._movedElement = null;
		}
		else {
			let dropCommands = this.getFirstInput("dropCommands");
			if(dropCommands) {
				this._performCommands(dropCommands, {"element": aElement, "data": aData});
			}
		}
	}
	
	_getOrderHierarchyItem(aOrderId, aActiveIds) {
		let editorSource = Wprr.sourceReference("editor");
		let orderEditorSource = editorSource.deeper("item.orderEditor");
		
		let orderEditor = this.getFirstInput(orderEditorSource);
		
		let hierarchyItem = orderEditor.getHierarchyForOrder(aOrderId);
		
		let hierarchy = hierarchyItem.getType("hierarchy");
		hierarchy.removeInactiveOrderedItems(aActiveIds);
		hierarchy.addUnorderedItems(aActiveIds);
		this._mainHierarchy = hierarchy;
		
		hierarchy.updateStructure();
		
		return hierarchyItem;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let editorSource = Wprr.sourceReference("editor");
		let orderEditorSource = editorSource.deeper("item.orderEditor");
		
		let orderEditor = this.getFirstInput(orderEditorSource);
		
		orderEditor.addOrder(this._elementTreeItem.getValue("slot/orderId"));
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
		
		return React.createElement("div", {className: "hierarchy-list"},
			React.createElement(Wprr.ReferenceInjection, {injectData: {"dragController": this}},
				React.createElement(Wprr.AddReference, {data: 0, as: "hierarchyIndent"}, 
					React.createElement(Wprr.AddReference, {data: aSlots.useProp("defaultSlot"), as: "hierarchyLevelList/slots/defaultSlot"}, 
						React.createElement(Wprr.AddReference, {data: orderId, as: "orderId"}, 
							React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(this, this._getOrderHierarchyItem, [orderId, activeIds]), as: "orderHierarchyItem"}, 
								React.createElement(Wprr.layout.relation.HierarchyLevelList, {})
							)
						)
					)
				)
			)
		);
	}
}
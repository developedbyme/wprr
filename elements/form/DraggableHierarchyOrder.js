import React from "react";
import Wprr from "wprr/Wprr";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";

import ReactChildFunctions from "wprr/utils/ReactChildFunctions";
import Layout from "wprr/elements/layout/Layout";
import DraggableHierarchyOrderList from "./DraggableHierarchyOrderList";

// import DraggableHierarchyOrder from "wprr/elements/form/DraggableHierarchyOrder";
export default class DraggableHierarchyOrder extends Layout {

	_construct() {
		super._construct();
		
		this._movedElement = null;
		
		let hierarchy = new Wprr.utils.Hierarchy();
		this._elementTreeItem.addType("hierarchy", hierarchy);
		
	}
	
	startDrag(aElement) {
		this._movedElement = aElement;
	}
	
	itemDroppedOn(aElement, aData) {
		//console.log("itemDroppedOn");
		//console.log(aElement, this._movedElement, aData);
		
		let order = this.getSource("order").value;
		
		if(this._movedElement) {
			let addMode = aElement.getFirstInput("addMode");
		
			if(addMode === "append") {
				let hierarchyItem = this._movedElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
				let atItem = aElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
			
				this._elementTreeItem.getType("hierarchy").moveToParent(hierarchyItem, atItem, -1);
			}
			else if(addMode === "insertBefore") {
				let hierarchyItem = this._movedElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
				let atItem = aElement.getFirstInput(Wprr.sourceReference("orderHierarchyItem"));
				
				let parent = atItem.getType("parent").linkedItem;
			
				let position = parent.getLinks("children").ids.indexOf(atItem.id);
				
				this._elementTreeItem.getType("hierarchy").moveToParent(hierarchyItem, parent, position);
			}
			
			this._movedElement = null;
			this.updateProp("order", this._elementTreeItem.getType("hierarchy").getJsonStructure());
		}
		else {
			let dropCommands = this.getFirstInput("dropCommands");
			if(dropCommands) {
				this._performCommands(dropCommands, {"element": aElement, "data": aData});
			}
		}
	}
	
	_prepareRender() {
		
		super._prepareRender();
		
		let order = this.getSource("order").value;
		let hierarchy = this._elementTreeItem.getType("hierarchy");
		
		hierarchy.setup(order);
	}
	
	_getLayout(aSlots) {
		//console.log("DraggableHierarchyOrder::_renderMainElement");
		
		aSlots.prop("order", []);
		
		return React.createElement("div", {},
			React.createElement(Wprr.ReferenceInjection, {injectData: {"dragController": this}},
				React.createElement(Wprr.AddReference, {data: this._elementTreeItem, "as": "orderHierarchyItem"},
					React.createElement(Wprr.AddReference, {data: 0, as: "hierarchyIndent"}, 
						React.createElement(DraggableHierarchyOrderList, {"items": this._elementTreeItem.getType("hierarchy").item.getLinks("children").idsSource},
							aSlots.default(React.createElement("div", {}, "No element set"))
						)
					)
				)
			)
		);
	}
}

import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemsTable extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		this.item.addType("controller", this);
		
		this.item.requireValue("rowClasses", "standard-row");
		this.item.requireValue("headerRowClasses", "standard-row");
		
		let activeList = this.item.addNode("activeList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		activeList.item.getLinks("items").input(this.item.getLinks("columns"));
		this.item.getLinks("activeRows").input(activeList.item.getLinks("sortedRows"));
		
		{
			let element = React.createElement(Wprr.layout.ItemList, {"ids": this.item.getLinks("activeRows").idsSource, "as": "columnRow", "className": this.item.getValueSource("rowClasses")},
				React.createElement(Wprr.RelatedItem, {"id": "forItem.linkedItem", "from": Wprr.sourceReference("columnRow"), "as": "column"},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("column", "cellElement")})
				),
				React.createElement(Wprr.FlexRow, {"data-slot": "insertElements", "className": "small-item-spacing flex-no-wrap"})
			);
	
			this.item.setValue("rowElement", element);
		}
		
		{
			let element = React.createElement(Wprr.layout.ItemList, {"ids": this.item.getLinks("activeRows").idsSource, "as": "columnRow", "className": this.item.getValueSource("headerRowClasses")},
				React.createElement(Wprr.RelatedItem, {"id": "forItem.linkedItem", "from": Wprr.sourceReference("columnRow"), "as": "column"},
					React.createElement(Wprr.InsertElement, {"element": Wprr.sourceReference("column", "headerCellElement")})
				),
				React.createElement(Wprr.FlexRow, {"data-slot": "insertElements", "className": "small-item-spacing flex-no-wrap"})
			);
	
			this.item.setValue("headerRowElement", element);
		}
		
		return this;
	}
	
	createColumn(aId, aType, aSettings = null) {
		
		let linkId = this.item.group.generateNextInternalId();
		
		let column = new Wprr.utils.data.multitypeitems.itemstable.ItemsTableColumn();
		let columnItem = this.item.group.getItem(linkId);
		columnItem.addType("column", column);
		
		column.setTableId(this.item.id);
		column.setup(aId, aType, aSettings);
		
		this.item.getLinks("columns").addItem(column.item.id);
		
		return column;
	}
	
	activateColumnById(aColumnId) {
		let activeList = Wprr.objectPath(this.item, "activeList.linkedItem.controller");
		
		activeList.activteRowBy("forItem.linkedItem.columnId.value", aColumnId)
		
		return this;
	}
	
	deactivateColumnById(aColumnId) {
		let activeList = Wprr.objectPath(this.item, "activeList.linkedItem.controller");
		
		activeList.deactivteRowBy("forItem.linkedItem.columnId.value", aColumnId)
		
		return this;
	}
	
	toJSON() {
		return "[ItemsTable id=" + this._id + "]";
	}
}
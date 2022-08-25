import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemsTable extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		this.item.addType("controller", this);
		
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
		this.item.getLinks("activeColumns").addItem(column.item.id);
		
		return column;
	}
	
	activateColumnById(aColumnId) {
		
		let column = Wprr.utils.array.getItemBy("columnId", aColumnId, this.item.getLinks("columns").linkedItems);
		
		this._internalLink_activateColumn(column);
		column._internalLink_activate();
		
		return this;
	}
	
	_internalLink_activateColumn(aColumn) {
		this.getLinks("activeColumns").addItem(aColumn.item.id);
		//METODO: sort according to colums
	}
	
	deactivateColumnById(aColumnId) {
		
	}
	
	_getColumnElement(aId) {
		//console.log("_getColumnElement");
		//console.log(aId);
		
		let column = this.item.group.getItem(aId);
		
		if(!column) {
			return null;
		}
		
		return column.getType("element");
	}
	
	createRowElement() {
		
		let itemMarkup = React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFunction(this, this._getColumnElement, [Wprr.sourceReference("loop/item")])});
		
		let element = Wprr.Loop.createMarkupLoop(this.item.getLinks("activeColumns").idsSource, itemMarkup, null, React.createElement(Wprr.FlexRow, {"className": "small-item-spacing flex-no-wrap"}));
		
		this.item.addType("rowElement", element);
	}
	
	toJSON() {
		return "[ItemsTable id=" + this._id + "]";
	}
}
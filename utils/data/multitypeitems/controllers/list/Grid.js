import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class Grid extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		let rows = this.item.getLinks("rows");
		
		let cellsItem = this.item.group.createInternalItem();
		this.item.addSingleLink("cells", cellsItem.id);
		
		let cells = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(cellsItem);
		cellsItem.addType("filteredListController", cells);
		
		let filterPartItem = this.item.group.createInternalItem();
		filterPartItem.setValue("field", "visible.value");
		filterPartItem.setValue("matchValue", true);
		filterPartItem.setValue("active", true);
		
		let filterPart = Wprr.utils.filterPartFunctions.createMatchField(filterPartItem.getType("field"), filterPartItem.getType("matchValue"), filterPartItem.getType("active"));
		filterPartItem.addType("filterPart", filterPart);
		
		cellsItem.getLinks("filterParts").addItem(filterPartItem.id);
		
		this.item.setValue("showCellTitles", "top");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("gridContoller", this);
		this.setup();
		
		return this;
	}
	
	addCell(aName, aElement, aVisible = true) {
		let newCell = this.item.group.createInternalItem();
		
		let controller = Wprr.utils.data.multitypeitems.controllers.list.Cell.create(newCell, aName, aElement, aVisible);
		newCell.addType("cellController", controller);
		newCell.addSingleLink("grid", this.item.id);
		
		Wprr.objectPath(this.item, "cells.linkedItem.all").addItem(newCell.id);
		
		return newCell;
	}
	
	toJSON() {
		return "[Grid id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newGrid = new Grid();
		newGrid.setupForItem(aItem);
		
		return newGrid;
	}
}
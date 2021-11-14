import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class SortedList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateSortPartsCommand = Wprr.commands.callFunction(this, this._updateSortParts);
		this._updateSortCommand = Wprr.commands.callFunction(this, this.updateSort);
		this._updateListenersCommand = Wprr.commands.callFunction(this, this._updateListeners);
		
		this._sortChain = Wprr.utils.SortChain.create();
	}
	
	setup() {
		
		this.item.getLinks("all").idsSource.addChangeCommand(this._updateSortCommand);
		this.item.getLinks("sorted");
		
		this.item.getLinks("sortParts").idsSource.addChangeCommand(this._updateSortPartsCommand);
		
		//METODO: change properties
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("filteredListController", this);
		this.setup();
		
		return this;
	}
	
	_updateSortParts() {
		console.log("_updateSortParts");
		
		let sortParts = Wprr.objectPath(this.item, "sortParts.items.(every).sortPart");
		this._sortChain.setParts(sortParts);
		this.updateSort();
	}
	
	updateSort() {
		console.log("updateSort");
		
		let items = this.item.getLinks("all").items;
		let sortedItems = this._sortChain.sort(items, null);
		
		this.item.getLinks("sorted").setItems(Wprr.utils.array.mapField(sortedItems, "id"));
	}
	
	addFieldSort(aField, aFormat = null) {
		let item = this.item.group.createInternalItem();
		
		let fieldSource = item.setValue("field", aField).getType("field");
		fieldSource.addChangeCommand(this._updateSortCommand);
		
		let formatSource = item.setValue("format", aFormat).getType("format");
		formatSource.addChangeCommand(this._updateSortCommand);
		
		let orderMultiplierSource = item.setValue("orderMultiplier", true).getType("orderMultiplier");
		orderMultiplierSource.addChangeCommand(this._updateSortCommand);
		
		let activeSource = item.setValue("active", true).getType("active");
		activeSource.addChangeCommand(this._updateSortCommand);
		
		let sortPart = this._sortChain.addFieldSort(fieldSource, formatSource, activeSource);
		sortPart.setInput("orderMultiplier", orderMultiplierSource);
		item.addType("sortPart", sortPart);
		
		this.item.getLinks("sortParts").addItem(item.id);
		
		return item;
	}
	
	_updateListeners() {
		console.log("_updateListeners");
		
		//METODO:
	}
	
	toJSON() {
		return "[SortedList id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newSortedList = new SortedList();
		newSortedList.setupForItem(aItem);
		
		return newSortedList;
	}
}
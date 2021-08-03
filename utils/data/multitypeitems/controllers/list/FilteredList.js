import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class FilteredList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateFilterPartsCommand = Wprr.commands.callFunction(this, this._updateFilterParts);
		this._updateFilterCommand = Wprr.commands.callFunction(this, this.updateFilter);
		this._updateListenersCommand = Wprr.commands.callFunction(this, this._updateListeners);
		
		this._filter = Wprr.utils.FilterChain.create();
	}
	
	setup() {
		
		this.item.getLinks("all").idsSource.addChangeCommand(this._updateFilterCommand);
		this.item.getLinks("filtered");
		
		this.item.getLinks("filterParts").idsSource.addChangeCommand(this._updateFilterPartsCommand);
		
		//METODO: change properties
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("filteredListController", this);
		this.setup();
		
		return this;
	}
	
	_updateFilterParts() {
		console.log("_updateFilterParts");
		
		let filterParts = Wprr.objectPath(this.item, "filterParts.items.(every).filterPart");
		this._filter.setParts(filterParts);
		this.updateFilter();
	}
	
	updateFilter() {
		console.log("updateFilter");
		
		let items = this.item.getLinks("all").items;
		let filteredItems = this._filter.filter(items, null);
		console.log(items, filteredItems, Wprr.utils.array.mapField(filteredItems, "id"));
		
		this.item.getLinks("filtered").setItems(Wprr.utils.array.mapField(filteredItems, "id"));
	}
	
	_updateListeners() {
		console.log("_updateListeners");
		
		//METODO:
	}
	
	toJSON() {
		return "[FilteredList id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newFilteredList = new FilteredList();
		newFilteredList.setupForItem(aItem);
		
		return newFilteredList;
	}
}
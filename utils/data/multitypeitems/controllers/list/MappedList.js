import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class MappedList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateMappedItemsCommand = Wprr.commands.callFunction(this, this.updateMappedItems);
		
	}
	
	setup() {
		
		this.item.getLinks("items").idsSource.addChangeCommand(this._updateMappedItemsCommand);
		this.item.getLinks("mappedItems");
		
		this.item.requireValue("backlinkName", "item");
		this.item.requireSingleLink("setup");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("mappedListController", this);
		this.setup();
		
		return this;
	}
	
	updateMappedItems() {
		console.log("updateMappedItems");
		
		let backlinkName = this.item.getValue("backlinkName");
		
		let items = this.item.getLinks("items").items;
		let mappedItems = Wprr.objectPath(this.item, "mappedItems.items.(every)." + backlinkName + ".linkedItem");
		
		let newItems = Wprr.utils.array.getUnselectedItems(mappedItems, items);
		let removedItems = Wprr.utils.array.getUnselectedItems(items, mappedItems);
		
		console.log(newItems, removedItems);
		
		//METODO:
		
		let newIds = Wprr.utils.array.mapField(newItems, "ids");
	}
	
	toJSON() {
		return "[MappedList id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newMappedList = new MappedList();
		newMappedList.setupForItem(aItem);
		
		return newMappedList;
	}
}
import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class MappedList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._itemAddedCommand = Wprr.commands.callFunction(this, this._itemAdded, [Wprr.sourceEvent()]);
		this._itemRemovedCommand = Wprr.commands.callFunction(this, this._itemRemoved, [Wprr.sourceEvent()]);
		this._updatedCommand = Wprr.commands.callFunction(this, this._itemsUpdated, [Wprr.sourceEvent()]);
		
	}
	
	setup() {
		
		this.item.getLinks("items");
		this.item.getLinks("temporaryItems");
		this.item.getLinks("mappedItems");
		
		let itemsChangeCommands = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("items").idsSource, this._itemAddedCommand, this._itemRemovedCommand, this._updatedCommand);
		this.item.addType("itemsChangeCommands", itemsChangeCommands);
		
		this.item.requireValue("backlinkName", "forItem");
		
		let setupCommands = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("mappedItems").idsSource);
		this.item.addType("setupCommands", setupCommands);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("mappedListController", this);
		this.setup();
		
		return this;
	}
	
	_itemAdded(aId) {
		//console.log("MappedList::_itemAdded");
		//console.log(aId);
		
		let backlinkName = this.item.getValue("backlinkName");
		
		let mappedItem = this.item.group.createInternalItem();
		mappedItem.addSingleLink(backlinkName, aId);
		
		this.item.getLinks("temporaryItems").addItem(mappedItem.id);
	}
	
	_removeRemoved(aId) {
		//console.log("MappedList::_removeRemoved");
		//console.log(aId);
		
		let backlinkName = this.item.getValue("backlinkName");
		
		let mappedItem = Wprr.utils.array.getItemBy(this.item.getLinks("temporaryItems").items, backlinkName + ".id", aId);
		
		if(mappedItem) {
			this.item.getLinks("temporaryItems").removeItem(mappedItem.id);
		}
	}
	
	_itemsUpdated() {
		//console.log("_itemsUpdated");
		//console.log(this.item.getLinks("temporaryItems").ids, this);
		this.item.getLinks("mappedItems").setItems(this.item.getLinks("temporaryItems").ids);
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
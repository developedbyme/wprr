import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ActiveList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._itemAddedCommand = Wprr.commands.callFunction(this, this._itemAdded, [Wprr.sourceEvent()]);
		this._itemRemovedCommand = Wprr.commands.callFunction(this, this._itemRemoved, [Wprr.sourceEvent()]);
		
		
	}
	
	setItems(aItems) {
		this.item.getLinks("items").input(aItems);
		
		return this;
	}
	
	get setupCommands() {
		return Wprr.objectPath(this.item, "mappedList.linkedItem.controller.setupCommands");
	}
	
	setup() {
		
		this.item.setValue("activteWhenAdded", true);
		this.item.addType("controller", this);
		
		this.item.getLinks("items");
		let mappedList = this.item.addNode("mappedList", new Wprr.utils.data.multitypeitems.controllers.list.MappedList()).setItems(this.item.getLinks("items"));
		
		mappedList.setupCommands.addCommands.push(this._itemAddedCommand);
		mappedList.setupCommands.removeCommands.push(this._itemRemovedCommand);
		
		this.item.getLinks("rows").input(mappedList.item.getLinks("mappedItems"));
		this.item.getLinks("activeRows");
		
		let sortedList = this.item.addNode("sortedList", new Wprr.utils.data.multitypeitems.controllers.list.SortedList());
		sortedList.setItems(this.item.getLinks("activeRows"));
		
		let sortPartItem = sortedList.addFieldAccordingToOrderSort("id", this.item.getLinks("rows").idsSource.value);
		sortPartItem.getType("order").input(this.item.getLinks("rows"));
		
		this.item.getLinks("sortedRows").input(sortedList.item.getLinks("sorted"));
		
		return this;
	}
	
	_itemAdded(aId) {
		console.log("ActiveList::_itemAdded");
		let item = this.item.group.getItem(aId);
		
		let active = this.item.getValue("activteWhenAdded");
		
		item.setValue("active", active);
		
		let inArrayCondition = item.addNode("inArrayCondition", new Wprr.utils.data.nodes.InArrayCondition());
		
		inArrayCondition.sources.get("array").input(this.item.getLinks("activeRows"));
		inArrayCondition.sources.get("value").input(aId);
		inArrayCondition.sources.get("isInArray").input(item.getType("active"));
		
		if(active) {
			this.item.getLinks("activeRows").addUniqueItem(aId);
		}
	}
	
	_itemRemoved(aId) {
		console.log("ActiveList::_itemRemoved");
		this.item.getLinks("activeRows").removeItem(aId);
	}
	
	activteRowBy(aField, aValue, aCompareType = "==") {
		console.log("activteRowBy");
		
		let items = Wprr.utils.array.getItemsBy(aField, aValue, this.item.getLinks("rows").items, aCompareType);
		this.item.getLinks("rows").addUniqueItems(Wprr.utils.array.mapField(items, "id"));
	}
	
	deactivteRowBy(aField, aValue, aCompareType = "==") {
		console.log("deactivteRowBy");
		
		let items = Wprr.utils.array.getItemsBy(aField, aValue, this.item.getLinks("rows").items, aCompareType);
		let newItems = Wprr.utils.array.removeValues([].concat(this.item.getLinks("rows").ids), Wprr.utils.array.mapField(items, "id"));
		this.item.getLinks("rows").setItems(newItems);
	}
	
	toJSON() {
		return "[ActiveList id=" + this._id + "]";
	}
}
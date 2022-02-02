import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

import MappedList from "./MappedList";

export default class MappedHierarchy extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._itemAddedCommand = Wprr.commands.callFunction(this, this._itemAdded, [Wprr.sourceEvent()]);
		this._itemRemovedCommand = Wprr.commands.callFunction(this, this._itemRemoved, [Wprr.sourceEvent()]);
		
	}
	
	setup() {
		
		let items = this.item.group;
		
		this.item.getLinks("items");
		
		this.item.getLinks("mappedItems");
		this.item.requireValue("childrenName", "children");
		
		let mappedList = MappedList.create(items.createInternalItem());
		mappedList.item.getType("mappedItems").idsSource.connectSource(this.item.getLinks("mappedItems").idsSource);
		this.item.addSingleLink("mappedList", mappedList.item.id);
		
		
		
		{
			let setupCommands = Wprr.objectPath(mappedList.item, "setupCommands");
			setupCommands.addCommands.push(this._itemAddedCommand);
			setupCommands.removeCommands.push(this._itemRemovedCommand);
		}
		
		
		this.item.getLinks("items").idsSource.connectSource(mappedList.item.getType("items").idsSource);
		
		{
			let setupCommands = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("allItems").idsSource);
			this.item.addType("setupCommands", setupCommands);
		}
		
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("mappedHierarchyController", this);
		this.setup();
		
		return this;
	}
	
	_itemAdded(aId, aParent = 0) {
		//console.log("MappedHierarchy::_itemAdded");
		//console.log(aId);
		
		let items = this.item.group;
		
		let item = items.getItem(aId);
		let forItem = Wprr.objectPath(item, "forItem.linkedItem");
		
		let childrenName = this.item.getValue("childrenName");
		
		if(aParent) {
			item.addSingleLink("parent", aParent);
		}
		
		let children = item.getLinks(childrenName);
		
		let mappedList = MappedList.create(items.createInternalItem());
		mappedList.item.getType("mappedItems").idsSource.connectSource(children.idsSource);
		
		let setupCommands = Wprr.objectPath(mappedList.item, "setupCommands");
		setupCommands.addCommands.push(Wprr.commands.callFunction(this, this._itemAdded, [Wprr.sourceEvent(), aId]));
		setupCommands.removeCommands.push(this._itemRemovedCommand);
		
		item.addSingleLink("mappedList", mappedList.item.id);
		
		forItem.getLinks(childrenName).idsSource.connectSource(mappedList.item.getType("items").idsSource);
		
		this.item.getLinks("allItems").addItem(aId);
		
	}
	
	_itemRemoved(aId) {
		//console.log("MappedHierarchy::_itemRemoved");
		//console.log(aId);
		
		let items = this.item.group;
		
		//METODO: remove group
		//METODO: remove from old items
	}
	
	toJSON() {
		return "[MappedHierarchy id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newMappedHierarchy = new MappedHierarchy();
		newMappedHierarchy.setupForItem(aItem);
		
		return newMappedHierarchy;
	}
}
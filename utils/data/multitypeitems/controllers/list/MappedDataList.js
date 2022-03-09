import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class MappedDataList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._itemRemovedCommand = Wprr.commands.callFunction(this, this._itemRemoved, [Wprr.sourceEvent()]);
		
	}
	
	get setupCommands() {
		return this.item.getType("setupCommands");
	}
	
	setItems(aItems) {
		this.item.getLinks("items").input(aItems);
		
		return this;
	}
	
	setup() {
		
		this.item.requireValue("data", []);
		this.item.requireValue("dataIdField", "key");
		this.item.requireValue("dataName", "data");
		this.item.requireValue("identifierName", "identifier");
		
		this.item.getType("data").addChangeCommand(Wprr.commands.callFunction(this, this._dataUpdated));
		
		this.item.getNamedLinks("itemsMap");
		this.item.getLinks("items");
		
		let itemsChangeCommands = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("items").idsSource, null, this._itemRemovedCommand, null);
		this.item.addType("itemsChangeCommands", itemsChangeCommands);
		
		let setupCommands = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("items").idsSource);
		this.item.addType("setupCommands", setupCommands);
		
		return this;
	}
	
	_dataUpdated() {
		
		let dataIdField = this.item.getValue("dataIdField");
		let dataName = this.item.getValue("dataName");
		let identifierName = this.item.getValue("identifierName");
		
		let itemsMap = this.item.getNamedLinks("itemsMap");
		
		let ids = new Array();
		
		let currentArray = this.item.getValue("data");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			
			let identifier = Wprr.objectPath(currentData, dataIdField);
			if(itemsMap.hasLinkByName(identifier)) {
				ids.push(itemsMap.getLinkByName(identifier).id);
			}
			else {
				let newItem = this.item.group.createInternalItem();
				
				newItem.setValue(dataName, currentData);
				newItem.setValue(identifierName, identifier);
				
				ids.push(newItem.id);
			}
		}
		
		this.item.getLinks("items").setItems(ids);
	}
	
	setupForItem(aItem) {
		aItem.addType("mappedDataListController", this);
		this.setup();
		
		return this;
	}
	
	_itemRemoved(aId) {
		//console.log("MappedDataList::_removeRemoved");
		//console.log(aId);
		
		//METODO
	}
	
	toJSON() {
		return "[MappedDataList id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newMappedDataList = new MappedDataList();
		newMappedDataList.setupForItem(aItem);
		
		return newMappedDataList;
	}
}
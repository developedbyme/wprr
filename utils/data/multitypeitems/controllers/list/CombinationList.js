import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class CombinationList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateCombinationCommand = Wprr.commands.callFunction(this, this._updateCombination, [Wprr.sourceEvent()]);
		
	}
	
	setItems(aLevel1Items, aLevel2Items) {
		this.item.getLinks("level1Items").input(aLevel1Items);
		this.item.getLinks("level2Items").input(aLevel2Items);
		
		return this;
	}
	
	setNames(aLevel1Name = null, aLevel2Name = null) {
		if(aLevel1Name) {
			this.item.setValue("level1Name", aLevel1Name);
		}
		if(aLevel2Name) {
			this.item.setValue("level2Name", aLevel2Name);
		}
		
		return this;
	}
	
	setup() {
		
		this.item.getLinks("level1Items").idsSource.addChangeCommand(this._updateCombinationCommand);
		this.item.getLinks("level2Items").idsSource.addChangeCommand(this._updateCombinationCommand);
		
		this.item.getLinks("combinedItems");
		this.item.getNamedLinks("combinedItemsMap");
		
		this.item.requireValue("level1Name", "level1");
		this.item.requireValue("level2Name", "level2");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("combinationListController", this);
		this.setup();
		
		return this;
	}
	
	_updateCombination() {
		let currentArray = this.item.getLinks("level1Items").ids;
		let currentArrayLength = currentArray.length;
		
		let currentArray2 = this.item.getLinks("level2Items").ids;
		let currentArray2Length = currentArray2.length;
		
		let combinedItemsMap = this.item.getNamedLinks("combinedItemsMap");
		
		let ids = new Array();
		let level1Name = this.item.getValue("level1Name");
		let level2Name = this.item.getValue("level2Name");
		
		for(let i = 0; i < currentArrayLength; i++) {
			for(let j = 0; j < currentArray2Length; j++) {
				let currentIdentifier = currentArray[i] + "-" + currentArray2[j];
				
				if(combinedItemsMap.hasLinkByName(currentIdentifier)) {
					let currentItem = combinedItemsMap.getLinkByName(currentIdentifier);
					ids.push(currentItem.id);
				}
				else {
					let newItem = this.item.group.createInternalItem();
					
					newItem.addSingleLink(level1Name, currentArray[i]);
					newItem.addSingleLink(level2Name, currentArray2[j]);
					
					combinedItemsMap.addItem(currentIdentifier, newItem.id);
					ids.push(newItem.id);
				}
			}
		}
		
		//METODO: remove removed items from map
		
		this.item.getLinks("combinedItems").setItems(ids);
	}
	
	toJSON() {
		return "[CombinationList id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newCombinationList = new CombinationList();
		newCombinationList.setupForItem(aItem);
		
		return newCombinationList;
	}
}
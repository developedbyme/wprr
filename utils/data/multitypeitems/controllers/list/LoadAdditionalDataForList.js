import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class LoadAdditionalDataForList extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._loadItemsCommand = Wprr.commands.callFunction(this, this._loadItems)
	}
	
	setup() {
		
		this.item.getLinks("items").idsSource.addChangeCommand(this._loadItemsCommand);
		this.item.addSingleLink("loader", 0);
		
		return this;
	}
	
	setLoaderPath(aPath) {
		this.item.getType("loader").setId(aPath);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("loadAdditionalDataForListController", this);
		this.setup();
		
		return this;
	}
	
	_loadItems() {
		console.log("_loadItems");
		
		let loader = this.item.getType("loader").linkedItem;
		let ids = this.item.getLinks("items").ids;
		console.log(loader, ids);
		
		if(loader) {
			loader.loadItems(ids);
		}
		else {
			console.error("No loader found", this);
		}
	}
	
	toJSON() {
		return "[LoadAdditionalDataForList id=" + this._id + "]";
	}
	
	static create(aItem, aLoaderPath) {
		let newLoadAdditionalDataForList = new LoadAdditionalDataForList();
		newLoadAdditionalDataForList.setupForItem(aItem);
		newLoadAdditionalDataForList.setLoaderPath(aLoaderPath);
		
		return newLoadAdditionalDataForList;
	}
}
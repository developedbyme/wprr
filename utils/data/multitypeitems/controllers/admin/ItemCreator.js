import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemCreator extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		
	}
	
	get createLoader() {
		return this.item.getType("createLoader");
	}
	
	get changeData() {
		return Wprr.objectPath(this.item.getType("createLoader"), "changeData");
	}
	
	setup() {
		
		this.item.setValue("created", false);
		this.item.setValue("ready", false);
		
		this.item.setValue("creationUrl", null);
		this.item.getType("creationUrl").addChangeCommand(Wprr.commands.callFunction(Wprr.sourceStatic(this.item, "createLoader"), "setUrl", [Wprr.sourceStatic(this.item, "creationUrl.value")]));
		this.item.addSingleLink("createdItem", null);
		this.item.setValue("initialDataUrl", null);
		this.item.getType("initialDataUrl").addChangeCommand(Wprr.commands.callFunction(Wprr.sourceStatic(this.item, "initialDataLoader"), "setUrl", [Wprr.sourceStatic(this.item, "initialDataUrl.value")]));
		
		this.item.setValue("initialData", null);
		
		let createLoader = this.item.group.project.getCreateLoader();
		createLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.source("event", "raw", "data.id")]));
		this.item.addType("createLoader", createLoader);
		
		let initialDataLoader = this.item.group.project.getLoader();
		this.item.addType("initialDataLoader", initialDataLoader);
		
		initialDataLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._initialDataLoaded, [Wprr.source("event", "raw", "data")]));
		
		this.item.getType("created").addChangeCommand(Wprr.commands.callFunction(this, this._continueAfterCreation));
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("itemCreator", this);
		this.setup();
		
		return this;
	}
	
	
	setUrl(aUrl) {
		
		this.item.setValue("creationUrl", aUrl);
		
		return this;
	}
	
	create() {
		this.item.getType("createLoader").load();
		
		return this;
	}
	
	_continueAfterCreation() {
		console.log("_continueAfterCreation");
		if(this.item.getValue("created")) {
			let initialDataLoader = this.item.getType("initialDataLoader");
			initialDataLoader.load();
		}
	}
	
	_itemCreated(aId) {
		this.item.getType("createdItem").setId(aId);
		this.item.setValue("created", true);
	}
	
	_initialDataLoaded(aData) {
		this.item.setValue("initialData", aData);
		this.item.setValue("ready", true);
	}
	
	toJSON() {
		return "[ItemCreator id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newItemCreator = new ItemCreator();
		
		newItemCreator.setupForItem(aItem);
		
		return newItemCreator;
	}
}
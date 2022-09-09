import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

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
		
		let project = Wprr.objectPath(this.item.group, "project.controller");
		
		this.item.requireValue("createdCommands", []);
		
		this.item.requireValue("created", false);
		this.item.requireValue("ready", false);
		
		
		this.item.getValueSource("creationUrl").addChangeCommand(Wprr.commands.callFunction(Wprr.sourceStatic(this.item, "createLoader"), "setUrl", [Wprr.sourceStatic(this.item, "creationUrl.value")]));
		if(project) {
			this.item.requireValue("creationUrl", project.getWprrUrl(Wprr.utils.wprrUrl.getCreateUrl("dbm_data")));
		}
		else {
			this.item.requireValue("creationUrl", "");
		}
		
		this.item.requireSingleLink("createdItem", null);
		this.item.requireSingleLink("initialLoader", null);
		this.item.getNamedLinks("createdRelations");
		
		this.item.requireValue("createResponseData", null);
		
		if(!this.item.hasType("createLoader")) {
			let createLoader = this.item.group.project.getCreateLoader();
			createLoader.addSuccessCommand(Wprr.commands.setValue(this.item.getValueSource("createResponseData").reSource(), "", Wprr.source("event", "raw", "data")));
			createLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.source("event", "raw", "data.id")]));
			this.item.addType("createLoader", createLoader);
		}
		
		this.item.getType("created").addChangeCommand(Wprr.commands.callFunction(this, this._continueAfterCreation));
		
		return this;
	}
	
	addLegacyInitialLoader() {
		console.warn("ItemCreator::addLegacyInitialLoader is deprecated");
		
		this.item.requireValue("initialDataUrl", null);
		this.item.getType("initialDataUrl").addChangeCommand(Wprr.commands.callFunction(Wprr.sourceStatic(this.item, "initialDataLoader"), "setUrl", [Wprr.sourceStatic(this.item, "initialDataUrl.value")]));
		
		if(!this.item.hasType("initialDataLoader")) {
			let initialDataLoader = this.item.group.project.getLoader();
			this.item.addType("initialDataLoader", initialDataLoader);
			initialDataLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._initialDataLoaded, [Wprr.source("event", "raw", "data")]));
		}
		
		this.item.requireValue("initialData", null);
		
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
			
			Wprr.utils.CommandPerformer.perform(this.item.getValue("createdCommands"), this.item);
			
			if(this.item.hasType("initialDataUrl") && this.item.getValue("initialDataUrl")) {
				let initialDataLoader = this.item.getType("initialDataLoader");
				initialDataLoader.load();
			}
			else {
				let loader = this.item.getSingleLink("initialLoader");
				if(loader) {
					//METODO: connect ready to loader
					loader.getLinks("items").addUniqueItem(this.item.getType("createdItem").id);
				}
				else {
					this.item.setValue("initialData", null);
					this.item.setValue("ready", true);
				}
			}
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
	
	_addObjectType(aItem, aType) {
		//console.log("_addObjectType");
		//console.log(aItem, aType);
		
		aItem.getLinks("objectTypes").addUniqueItem("dbm_type:" + aType);
		aItem.getLinks("terms").addUniqueItem("dbm_type:" + aType);
	}
	
	setTitle(aTitle) {
		this.changeData.setTitle(aTitle);
		
		return this;
	}
	
	setDataType(aType) {
		
		//METODO: warning if already set
		
		this.changeData.addSetting("dataType", aType);
		
		this.item.getValue("createdCommands").push(Wprr.commands.callFunction(this, this._addObjectType, [Wprr.sourceEvent("createdItem.linkedItem"), aType]));
		
		return this;
	}
	
	addType(aType) {
		this.changeData.addTerm(aType, "dbm_type", "slugPath");
		
		this.item.getValue("createdCommands").push(Wprr.commands.callFunction(this, this._addObjectType, [Wprr.sourceEvent("createdItem.linkedItem"), aType]));
		
		return this;
	}
	
	_setupRelation(aRelationId, aType, aFromId, aToId, aStatus) {
		//console.log("_setupRelation");
		//console.log(aRelationId, aType, aFromId, aToId, aStatus);
		
		let fromItem = this.item.group.getItem(aFromId);
		let relationItem = this.item.group.getItem(aRelationId);
		let toItem = this.item.group.getItem(aToId);
		
		fromItem.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
		
		relationItem.addSingleLink("from", fromItem.id);
		relationItem.addSingleLink("to", toItem.id);
		relationItem.addSingleLink("type", "dbm_type:object-relation/" + aType);
		
		relationItem.setValue("startAt", moment().unix());
		relationItem.setValue("endAt", -1);
		relationItem.setValue("postStatus", aStatus);
		
		toItem.getLinks("incomingRelations").addUniqueItem(relationItem.id);
		
	}
	
	addOutgoingRelation(aId, aType, aMakePrivate = false) {
		
		let createdRelations = this.item.getNamedLinks("createdRelations");
		let numberOfRelations = createdRelations.ids.length;
		let currentId = "relation" + numberOfRelations;
		createdRelations.addItem(currentId, 0);
		
		this.changeData.addOutgoingRelation(aId, aType, aMakePrivate, currentId);
		
		let status = aMakePrivate ? "private" : "draft";
		
		this.item.getValue("createdCommands").push(Wprr.commands.callFunction(createdRelations, createdRelations.updateItem, [currentId, Wprr.sourceEvent("createResponseData.value." + currentId + "/relationId")]));
		this.item.getValue("createdCommands").push(Wprr.commands.callFunction(this, this._setupRelation, [Wprr.sourceEvent("createdRelations." + currentId + ".id"), aType, Wprr.sourceEvent("createdItem.id"), aId, status]));
		
		return this;
	}
	
	addIncomingRelation(aId, aType, aMakePrivate = false) {
		
		let createdRelations = this.item.getNamedLinks("createdRelations");
		let numberOfRelations = createdRelations.ids.length;
		let currentId = "relation" + numberOfRelations;
		createdRelations.addItem(currentId, 0);
		
		this.changeData.addIncomingRelation(aId, aType, aMakePrivate, currentId);
		
		let status = aMakePrivate ? "private" : "draft";
		
		this.item.getValue("createdCommands").push(Wprr.commands.callFunction(createdRelations, createdRelations.updateItem, [currentId, Wprr.sourceEvent("createResponseData.value." + currentId + "/relationId")]));
		this.item.getValue("createdCommands").push(Wprr.commands.callFunction(this, this._setupRelation, [Wprr.sourceEvent("createdRelations." + currentId + ".id"), aType, aId, Wprr.sourceEvent("createdItem.id"), status]));
		
		return this;
	}
	
	addCreatedCommand(aCommand) {
		
		let createdCommands = this.item.getValueSource("createdCommands");
		
		createdCommands.value.push(aCommand);
		createdCommands.updateForValueChange();
		
		return this;
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
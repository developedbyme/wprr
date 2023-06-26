import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemUpdater extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		
	}
	
	get updateLoader() {
		return this.item.getType("updateLoader");
	}
	
	get changeData() {
		return Wprr.objectPath(this.item.getType("updateLoader"), "changeData");
	}
	
	setup() {
		
		let project = Wprr.objectPath(this.item.group, "project.controller");
		
		this.item.requireValue("updatedCommands", []);
		
		this.item.requireValue("updated", false);
		this.item.requireValue("ready", false);
		
		this.item.requireSingleLink("forItem");
		this.item.getType("forItem").idSource.addChangeCommand(Wprr.commands.callFunction(this, this._updateUrl));
		
		
		this.item.getValueSource("updateUrl").addChangeCommand(Wprr.commands.callFunction(Wprr.sourceStatic(this.item, "updateLoader"), "setUrl", [Wprr.sourceStatic(this.item, "updateUrl.value")]));
		this.item.requireValue("updateUrl", "");
		
		
		this.item.requireSingleLink("updatedItem", null);
		this.item.requireSingleLink("initialLoader", null);
		this.item.getNamedLinks("updatedRelations");
		
		this.item.requireValue("updateResponseData", null);
		
		if(!this.item.hasType("updateLoader")) {
			let updateLoader = new Wprr.utils.loading.EditLoader();
			project.addUserCredentialsToLoader(updateLoader);
			updateLoader.addSuccessCommand(Wprr.commands.setValue(this.item.getValueSource("updateResponseData").reSource(), "", Wprr.source("event", "raw", "data")));
			updateLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.source("event", "raw", "data.id")]));
			this.item.addType("updateLoader", updateLoader);
		}
		
		this.item.getType("updated").addChangeCommand(Wprr.commands.callFunction(this, this._continueAfterCreation));
		
		return this;
	}
	
	_updateUrl() {
		let id = this.item.getType("forItem").idSource.value;
		
		let project = Wprr.objectPath(this.item.group, "project.controller");
		let url = project.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(id));
		
		this.item.setValue("updateUrl", url);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("itemUpdater", this);
		this.setup();
		
		return this;
	}
	
	update() {
		//this.item.getType("updateLoader").load();
		
		let sharedLoadingSequence = Wprr.objectPath(this.item.group, "project.sharedLoadingSequence");
		this.addLoaderToSequence(sharedLoadingSequence);
		
		return this;
	}
	
	addLoaderToSequence(aSequence) {
		//console.log("addLoaderToSequence");
		//console.log(aSequence);
		
		let loader = this.item.getType("updateLoader");
		
		aSequence.addLoader(loader);
		
		return this;
	}
	
	_continueAfterCreation() {
		//console.log("_continueAfterCreation");
		
		if(this.item.getValue("updated")) {
			
			Wprr.utils.CommandPerformer.perform(this.item.getValue("updatedCommands"), this.item);
			
			if(this.item.hasType("initialDataUrl") && this.item.getValue("initialDataUrl")) {
				let initialDataLoader = this.item.getType("initialDataLoader");
				initialDataLoader.load();
			}
			else {
				let loader = this.item.getSingleLink("initialLoader");
				if(loader) {
					//METODO: connect ready to loader
					loader.getLinks("items").addUniqueItem(this.item.getType("updatedItem").id);
				}
				else {
					this.item.setValue("initialData", null);
					this.item.setValue("ready", true);
				}
			}
		}
	}
	
	_itemCreated(aId) {
		this.item.getType("updatedItem").setId(aId);
		this.item.setValue("updated", true);
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
	
	addType(aType) {
		this.changeData.addTerm(aType, "dbm_type", "slugPath");
		
		this.item.getValue("updatedCommands").push(Wprr.commands.callFunction(this, this._addObjectType, [Wprr.sourceEvent("updatedItem.linkedItem"), aType]));
		
		return this;
	}
	
	_setupRelation(aRelationId, aType, aFromId, aToId, aStartTime, aStatus) {
		//console.log("_setupRelation");
		//console.log(aRelationId, aType, aFromId, aToId, aStatus);
		
		let fromItem = this.item.group.getItem(aFromId);
		let relationItem = this.item.group.getItem(aRelationId);
		let toItem = this.item.group.getItem(aToId);
		
		relationItem.addSingleLink("from", fromItem.id);
		relationItem.addSingleLink("to", toItem.id);
		relationItem.addSingleLink("type", "dbm_type:object-relation/" + aType);
		
		relationItem.setValue("startAt", aStartTime);
		relationItem.setValue("endAt", -1);
		relationItem.setValue("postStatus", aStatus);
		
		fromItem.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
		toItem.getLinks("incomingRelations").addUniqueItem(relationItem.id);
		
	}
	
	addOutgoingRelation(aId, aType, aMakePrivate = false) {
		
		let updatedRelations = this.item.getNamedLinks("updatedRelations");
		let numberOfRelations = updatedRelations.ids.length;
		let currentId = "relation" + numberOfRelations;
		updatedRelations.addItem(currentId, 0);
		
		this.changeData.addOutgoingRelation(aId, aType, aMakePrivate, currentId);
		
		let status = aMakePrivate ? "private" : "draft";
		
		this.item.getValue("updatedCommands").push(Wprr.commands.callFunction(updatedRelations, updatedRelations.updateItem, [currentId, Wprr.sourceEvent("updateResponseData.value." + currentId + "/relationId")]));
		this.item.getValue("updatedCommands").push(Wprr.commands.callFunction(this, this._setupRelation, [Wprr.sourceEvent("updatedRelations." + currentId + ".id"), aType, Wprr.sourceEvent("updatedItem.id"), aId, Wprr.sourceEvent("updateResponseData.value." + currentId + "/relationTime"), status]));
		
		return this;
	}
	
	addIncomingRelation(aId, aType, aMakePrivate = false) {
		
		let updatedRelations = this.item.getNamedLinks("updatedRelations");
		let numberOfRelations = updatedRelations.ids.length;
		let currentId = "relation" + numberOfRelations;
		updatedRelations.addItem(currentId, 0);
		
		this.changeData.addIncomingRelation(aId, aType, aMakePrivate, currentId);
		
		let status = aMakePrivate ? "private" : "draft";
		
		this.item.getValue("updatedCommands").push(Wprr.commands.callFunction(updatedRelations, updatedRelations.updateItem, [currentId, Wprr.sourceEvent("updateResponseData.value." + currentId + "/relationId")]));
		this.item.getValue("updatedCommands").push(Wprr.commands.callFunction(this, this._setupRelation, [Wprr.sourceEvent("updatedRelations." + currentId + ".id"), aType, aId, Wprr.sourceEvent("updatedItem.id"), Wprr.sourceEvent("updateResponseData.value." + currentId + "/relationTime"), status]));
		
		return this;
	}
	
	addCreatedCommand(aCommand) {
		
		let updatedCommands = this.item.getValueSource("updatedCommands");
		
		updatedCommands.value.push(aCommand);
		updatedCommands.updateForValueChange();
		
		return this;
	}
	
	toJSON() {
		return "[ItemUpdater id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newItemUpdater = new ItemUpdater();
		
		newItemUpdater.setupForItem(aItem);
		
		return newItemUpdater;
	}
}
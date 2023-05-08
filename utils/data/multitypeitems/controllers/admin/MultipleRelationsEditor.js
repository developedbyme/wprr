import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class MultipleRelationsEditor extends MultiTypeItemConnection {
	
	constructor() {
		//console.log("MultipleRelationsEditor::constructor");
		
		super();
		
		
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.requireSingleLink("relationEditor");
		
		this.item.getLinks("activeRelations").idsSource.addChangeCommand(Wprr.commands.callFunction(this, this._relationsUpdated));
		this.item.getLinks("activeItems").idsSource.addChangeCommand(Wprr.commands.callFunction(this, this._itemUpdated));
		this.item.getLinks("pendingItems");
		
		return this;
	}
	
	get activeItemsSource() {
		return this.item.getLinks("activeItems").idsSource;
	}
	
	setItems(aIds) {
		this.item.getLinks("activeItems").setItems(aIds);
		
		return this;
	}
	
	addUniqueItem(aId) {
		this.item.getLinks("activeItems").addUniqueItem(aId);
		
		return this;
	}
	
	_createRelation(aItemId) {
		//console.log("_createRelation");
		
		this.item.getLinks("pendingItems").addUniqueItem(aItemId);
		
		let project = Wprr.objectPath(this.item.group, "project.controller");
		
		let baseObjectId = Wprr.objectPath(this.item, "relationEditor.linkedItem.editedItem.id"); 
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		let connectionType = Wprr.objectPath(this.item, "relationEditor.linkedItem.connectionType.id").split("/").pop(); 
		let itemId = aItemId;
		
		let loader = project.getEditLoader(baseObjectId);
		if(direction === "incoming") {
			loader.changeData.addIncomingRelation(itemId, connectionType, false);
		}
		else if(direction === "outgoing") {
			loader.changeData.addOutgoingRelation(itemId, connectionType, false);
		}
	
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._relationCreated, [itemId, Wprr.sourceEvent("data.relationId")]));
	
		loader.load();
	}
	
	_relationCreated(aId, aRelationId) {
		//console.log("_relationCreated");
		
		let itemId = Wprr.objectPath(this.item, "relationEditor.linkedItem.editedItem.id");
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		
		let newItem = this.item.group.getItem(aId);
		let relationItem = this.item.group.getItem(aRelationId);
		let item = this.item.group.getItem(itemId);
		
		let connectionType = Wprr.objectPath(this.item, "relationEditor.linkedItem.connectionType.id");
		relationItem.addSingleLink("type", connectionType);
		
		relationItem.setValue("startAt", moment().unix());
		relationItem.setValue("endAt", -1);
		relationItem.setValue("postStatus", "draft");
		
		if(direction === "incoming") {
			relationItem.addSingleLink("from", newItem.id);
			relationItem.addSingleLink("to", item.id);
			
			newItem.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
			
			item.getLinks("incomingRelations").addUniqueItem(relationItem.id);
		}
		else {
			relationItem.addSingleLink("to", newItem.id);
			relationItem.addSingleLink("from", item.id);
			
			newItem.getLinks("incomingRelations").addUniqueItem(relationItem.id);
			
			item.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
		}
		
		let editorsGroup = Wprr.objectPath(this.item, "relationEditor.linkedItem.editorsGroup.linkedItem.editorsGroup");
		
		let postStatusEditor = editorsGroup.getItemEditor(relationItem.id).getPostStatusEditor();
		
		postStatusEditor.item.setValue("value", "private");
		
		this.item.getLinks("pendingItems").removeItem(aId);
		
	}
	
	_itemUpdated() {
		//console.log("_itemUpdated");
		//console.log(this._debugId, Wprr.objectPath(this.item, "relationEditor.linkedItem.connectionType.id"));
		
		if(this._isUpdating) {
			return;
		}
		
		this._isUpdating = true;
		
		let currentActiveIds = this._getActiveItemsFromRelations();
		currentActiveIds = [].concat(currentActiveIds, this.item.getLinks("pendingItems").ids);
		let activeIds = this.item.getLinks("activeItems").ids;
		
		let itemsToCreate = Wprr.utils.array.removeValues(activeIds, currentActiveIds);
		let itemsToRemove = Wprr.utils.array.removeValues(currentActiveIds, activeIds);
		
		let relationsToRemove = this._getRelationsFromItems(itemsToRemove);
		
		this._endRelations(relationsToRemove);
		
		{
			let currentArray = itemsToCreate;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				this._createRelation(currentArray[i]);
			}
		}
		
		this._isUpdating = false;
	}
	
	_relationsUpdated() {
		//console.log("_relationsUpdated");
		//console.log(this);
		
		let newIds = this._getActiveItemsFromRelations();
		
		newIds = [].concat(newIds, this.item.getLinks("pendingItems").ids);
		
		this._isUpdating = true;
		this.item.getLinks("activeItems").setItems(newIds);
		this._isUpdating = false;
		
	}
	
	_getActiveItemsFromRelations() {
		
		let returnArray = new Array();
		
		let relations = this.item.getLinks("activeRelations").items;
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		
		let currentArray = relations;
		let currentArrayLength = currentArray.length;
		
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRelation = currentArray[i];
			let linkName = "to.id";
			if(direction === "incoming") {
				linkName = "from.id";
			}
			
			returnArray.push(Wprr.objectPath(currentRelation, linkName));
		}
		
		return Wprr.utils.array.removeDuplicates(returnArray);
	}
	
	_getRelationsFromItems(aIds) {
		let relations = this.item.getLinks("activeRelations").items;
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		
		let linkName = "to.id";
		if(direction === "incoming") {
			linkName = "from.id";
		}
		
		return Wprr.utils.array.getItemsBy(linkName, aIds, relations, "inArray");
	}
	
	_endRelations(aRelations) {
		//console.log("_endRelations");
		//console.log(aRelations);
		
		let currentTime = moment().unix();
		let editorsGroup = Wprr.objectPath(this.item, "relationEditor.linkedItem.editorsGroup.linkedItem.editorsGroup");
		
		let currentArray = aRelations;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRelation = currentArray[i];
			let fieldEditor = editorsGroup.getItemEditor(currentRelation.id).getFieldEditor("endAt");
			let endTime = fieldEditor.value;
			if(endTime === -1 || endTime > currentTime) {
				fieldEditor.valueSource.value = currentTime;
			}
		}
	}
	
	toJSON() {
		return "[MultipleRelationsEditor id=" + this._id + "]";
	}
}
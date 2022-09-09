import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class SingleRelationEditor extends MultiTypeItemConnection {
	
	constructor() {
		//console.log("SingleRelationEditor::constructor");
		
		super();
		
		
	}
	
	setup() {
		
		this.item.addType("controller", this);
		this.item.requireSingleLink("relationEditor");
		
		this.item.getLinks("activeRelations").idsSource.addChangeCommand(Wprr.commands.callFunction(this, this._relationsUpdated));
		this.item.addSingleLink("activeItem");
		this.item.getType("activeItem").idSource.addChangeCommand(Wprr.commands.callFunction(this, this._itemUpdated));
		
		return this;
	}
	
	get activeItemSource() {
		return this.item.getType("activeItem").idSource;
	}
	
	setValue(aValue) {
		this.item.addSingleLink("activeItem", aValue);
		
		return this;
	}
	
	_createRelation() {
		//console.log("_createRelation");
		
		let project = Wprr.objectPath(this.item.group, "project.controller");
		
		let baseObjectId = Wprr.objectPath(this.item, "relationEditor.linkedItem.editedItem.id"); 
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		let connectionType = Wprr.objectPath(this.item, "relationEditor.linkedItem.connectionType.id").split("/").pop(); 
		let itemId = this.item.getType("activeItem").id;
		let relations = this.item.getLinks("activeRelations").items;
		
		if(itemId) {
			let loader = project.getEditLoader(baseObjectId);
			if(direction === "incoming") {
				loader.changeData.addIncomingRelation(itemId, connectionType, false);
			}
			else if(direction === "outgoing") {
				loader.changeData.addOutgoingRelation(itemId, connectionType, false);
			}
		
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._relationCreated, [itemId, Wprr.sourceEvent("data.relationId")]));
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._endRelations, [relations]));
		
			loader.load();
		}
		else {
			this._endRelations(relations);
		}
	}
	
	_relationCreated(aId, aRelationId) {
		//console.log("_relationCreated");
		//console.log(aId, aRelationId);
		
		let itemId = Wprr.objectPath(this.item, "relationEditor.linkedItem.editedItem.id");
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		
		let newItem = this.item.group.getItem(aId);
		let relationItem = this.item.group.getItem(aRelationId);
		let item = this.item.group.getItem(itemId);
		
		if(direction === "incoming") {
			newItem.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
			
			relationItem.addSingleLink("from", newItem.id);
			relationItem.addSingleLink("to", item.id);
		}
		else if(direction === "outgoing") {
			newItem.getLinks("incomingRelations").addUniqueItem(relationItem.id);
			
			relationItem.addSingleLink("to", newItem.id);
			relationItem.addSingleLink("from", item.id);
		}
		
		let connectionType = Wprr.objectPath(this.item, "relationEditor.linkedItem.connectionType.id");
		relationItem.addSingleLink("type", connectionType);
		
		relationItem.setValue("startAt", moment().unix());
		relationItem.setValue("endAt", -1);
		relationItem.setValue("postStatus", "draft");
		
		if(direction === "incoming") {
			item.getLinks("incomingRelations").addUniqueItem(relationItem.id);
		}
		else {
			item.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
		}
		
		let editorsGroup = Wprr.objectPath(this.item, "relationEditor.linkedItem.editorsGroup.linkedItem.editorsGroup");
		
		let postStatusEditor = editorsGroup.getItemEditor(relationItem.id).getPostStatusEditor();
		
		postStatusEditor.item.setValue("value", "private");
	}
	
	_itemUpdated() {
		//console.log("_itemUpdated");
		//console.log(this);
		
		let itemId = this.item.getType("activeItem").id;
		
		let currentActiveId = this._getActiveItemFromRelations();
		if(itemId !== currentActiveId) {
			this._createRelation();
		}
	}
	
	_relationsUpdated() {
		//console.log("_relationsUpdated");
		//console.log(this);
		
		let newId = this._getActiveItemFromRelations();
		
		this.item.addSingleLink("activeItem", newId);
	}
	
	_getActiveItemFromRelations() {
		let relations = this.item.getLinks("activeRelations").items;
		let direction = Wprr.objectPath(this.item, "relationEditor.linkedItem.direction.value");
		
		let activeId = 0;
		if(relations.length > 0) {
			let lastRelation = relations[relations.length-1];
			let linkName = "to.id";
			if(direction === "incoming") {
				linkName = "from.id";
			}
			
			activeId = Wprr.objectPath(lastRelation, linkName);
		}
		
		return activeId;
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
		return "[SingleRelationEditor id=" + this._id + "]";
	}
}
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
	
	_createRelation(aRelatedItemId) {
		//console.log("_createRelation");
		
		this.item.getLinks("pendingItems").addUniqueItem(aRelatedItemId);
		
		let relationEditor = Wprr.objectPath(this.item, "relationEditor.linkedItem.relationEditor");
		let loader = relationEditor.createRelation(aRelatedItemId);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._relationCreated, [aRelatedItemId]));
	}
	
	_relationCreated(aId) {
		//console.log("_relationCreated");
		
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
			else if(direction === "user") {
				linkName = "user.id";
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
		else if(direction === "user") {
			linkName = "user.id";
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
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
	
	get value() {
		return this.item.getType("activeItem").id;
	}
	
	get activeItemSource() {
		return this.item.getType("activeItem").idSource;
	}
	
	setValue(aValue) {
		
		this.item.addSingleLink("activeItem", aValue);
		
		
		return this;
	}
	
	removeValue() {
		this.item.addSingleLink("activeItem", 0);
		
		return this;
	}
	
	_createRelation() {
		//console.log("_createRelation");
		
		let relationEditor = Wprr.objectPath(this.item, "relationEditor.linkedItem.relationEditor");
		
		let itemId = this.item.getType("activeItem").id;
		
		if(itemId) {
			let loader = relationEditor.createRelation(itemId);
			let relations = relationEditor.item.getLinks("activeRelations").items;
			loader.addSuccessCommand(Wprr.commands.callFunction(relationEditor, relationEditor._endRelations, [relations, moment().unix()]));
		}
		else {
			relationEditor.endAllRelations();
		}
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
			else if(direction === "user") {
				linkName = "user.id";
			}
			
			activeId = Wprr.objectPath(lastRelation, linkName);
		}
		
		return activeId;
	}
	
	toJSON() {
		return "[SingleRelationEditor id=" + this._id + "]";
	}
}
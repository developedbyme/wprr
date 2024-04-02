import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.requireSingleLink("editedItem");
		
		this.item.getNamedLinks("fieldEditors");
		this.item.getNamedLinks("relationEditors");
		this.item.getNamedLinks("orderEditors");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("itemEditor", this);
		this.setup();
		
		return this;
	}
	
	get editorsGroup() {
		return this.item.getType("editorsGroup").linkedItem.getType("editorsGroup");
	}
	
	get editedItem() {
		return this.item.getSingleLink("editedItem");
	}
	
	getFieldEditor(aName) {
		//console.log("getFieldEditor");
		//console.log(aName);
		
		let fieldEditors = this.item.getNamedLinks("fieldEditors");
		
		if(!fieldEditors.hasLinkByName(aName)) {
			let fieldEditor = this.editorsGroup.getFieldEditor(this.item.getType("editedItem").id, aName);
			
			fieldEditors.addItem(aName, fieldEditor.item.id);
		}
		
		return fieldEditors.getLinkByName(aName).getType("valueEditor");
	}
	
	getRelationFieldEditor(aName) {
		//console.log("getRelationFieldEditor");
		//console.log(aName);
		
		let fieldEditors = this.item.getNamedLinks("fieldEditors");
		
		if(!fieldEditors.hasLinkByName(aName)) {
			let fieldEditor = this.editorsGroup.getRelationFieldEditor(this.item.getType("editedItem").id, aName);
			
			fieldEditors.addItem(aName, fieldEditor.item.id);
		}
		
		return fieldEditors.getLinkByName(aName).getType("valueEditor");
	}
	
	getCustomPathFieldEditor(aName, aValuePath) {
		let fieldEditors = this.item.getNamedLinks("fieldEditors");
		
		if(!fieldEditors.hasLinkByName(aName)) {
			let fieldEditor = this.editorsGroup.getCustomPathFieldEditor(this.item.getType("editedItem").id, aName, aValuePath);
			
			fieldEditors.addItem(aName, fieldEditor.item.id);
		}
		
		return fieldEditors.getLinkByName(aName).getType("valueEditor");
	}
	
	getTitleEditor() {
		return this.editorsGroup.getTitleEditor(this.item.getType("editedItem").id);
	}
	
	getContentEditor() {
		return this.editorsGroup.getContentEditor(this.item.getType("editedItem").id);
	}
	
	getPostStatusEditor() {
		return this.editorsGroup.getPostStatusEditor(this.item.getType("editedItem").id);
	}
	
	getMetaEditor(aMetaKey, aFieldName = null) {
		return this.editorsGroup.getMetaEditor(this.item.getType("editedItem").id, aMetaKey, aFieldName);
	}
	
	addEditorsForFields() {
		//console.log("addEditorsForFields");
		
		let fields = Wprr.objectPath(this.item, "editedItem.linkedItem.fields");
		
		let editorIds = new Array();
		
		let currentArray = fields.names;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			
			this.getFieldEditor(currentName);
		}
	}
	
	getRelationEditor(aDirection, aConnectionType, aItemType) {
		
		let linkName = aDirection + "-" + aConnectionType + "-" + aItemType;
		let relationEditors = this.item.getNamedLinks("relationEditors");
		
		if(!relationEditors.hasLinkByName(linkName)) {
			let relationEditor = this.editorsGroup.getRelationEditor(this.item.getType("editedItem").id, aDirection, aConnectionType, aItemType);
			relationEditors.addItem(linkName, relationEditor.item.id);
		}
		
		return relationEditors.getLinkByName(linkName).getType("relationEditor");
	}
	
	getUserRelationEditor(aConnectionType) {
		let linkName = "userRelation-" + aConnectionType;
		let relationEditors = this.item.getNamedLinks("relationEditors");
		
		if(!relationEditors.hasLinkByName(linkName)) {
			let relationEditor = this.editorsGroup.getUserRelationEditor(this.item.getType("editedItem").id, aConnectionType);
			relationEditors.addItem(linkName, relationEditor.item.id);
		}
		
		return relationEditors.getLinkByName(linkName).getType("relationEditor");
	}
	
	getOrderEditor(aForType) {
		let linkName = "order-" + aForType;
		let orderEditors = this.item.getNamedLinks("orderEditors");
		
		if(!orderEditors.hasLinkByName(linkName)) {
			let orderEditor = this.editorsGroup.getOrderEditor(this.item.getType("editedItem").id, aForType);
			orderEditors.addItem(linkName, orderEditor.item.id);
		}
		
		return orderEditors.getLinkByName(linkName).getType("orderEditor");
	}
	
	getHierarchyOrderEditor(aForType) {
		let linkName = "hierarchy-order-" + aForType;
		let orderEditors = this.item.getNamedLinks("orderEditors");
		
		if(!orderEditors.hasLinkByName(linkName)) {
			let orderEditor = this.editorsGroup.getHierarchyOrderEditor(this.item.getType("editedItem").id, aForType);
			orderEditors.addItem(linkName, orderEditor.item.id);
		}
		
		return orderEditors.getLinkByName(linkName).getType("orderEditor");
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		//console.log("ItemEditor::getValueForPath");
		//console.log(aPath);
		
		let tempArray = (""+aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "fieldEditor":
				{
					let fieldName = tempArray.shift();
					restParts = tempArray.join(".");
					return Wprr.objectPath(this.getFieldEditor(fieldName), restParts);
				}
			case "relationEditor":
				{
					let direction = tempArray.shift();
					let connectionType = tempArray.shift();
					let itemType = tempArray.shift();
					restParts = tempArray.join(".");
					return Wprr.objectPath(this.getRelationEditor(direction, connectionType, itemType), restParts);
				}
			case "userRelationEditor":
				{
					let connectionType = tempArray.shift();
					restParts = tempArray.join(".");
					return Wprr.objectPath(this.getUserRelationEditor(connectionType), restParts);
				}
			case "contentEditor":
				{
					restParts = tempArray.join(".");
					return Wprr.objectPath(this.getContentEditor(), restParts);
				}
			case "postStatusEditor":
				{
					restParts = tempArray.join(".");
					return Wprr.objectPath(this.getPostStatusEditor(), restParts);
				}
			case "metaEditor":
				{
					let fieldName = tempArray.shift();
					restParts = tempArray.join(".");
					return Wprr.objectPath(this.getMetaEditor(fieldName), restParts);
				}
		}
		
		return Wprr.objectPath(this[firstPart], restParts);
	}
	
	toJSON() {
		return "[ItemEditor id=" + this._id + "]";
	}
	
	static create(aItem, aEditedItemId = 0) {
		let newItemEditor = new ItemEditor();
		
		newItemEditor.setupForItem(aItem);
		if(aEditedItemId) {
			aItem.addSingleLink("editedItem", aEditedItemId);
		}
		
		return newItemEditor;
	}
}
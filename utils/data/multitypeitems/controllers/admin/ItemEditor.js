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
	
	getFieldEditor(aName) {
		
		let fieldEditors = this.item.getNamedLinks("fieldEditors");
		
		if(!fieldEditors.hasLinkByName(aName)) {
			let fieldEditor = this.editorsGroup.getFieldEditor(this.item.getType("editedItem").id, aName);
			
			fieldEditors.addItem(aName, fieldEditor.item.id);
		}
		
		return fieldEditors.getLinkByName(aName).getType("valueEditor");
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
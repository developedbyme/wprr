import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ItemEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.requireSingleLink("editedItem");
		
		Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup.create(this.item);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("itemEditor", this);
		this.setup();
		
		return this;
	}
	
	addEditorsForFields() {
		//console.log("addEditorsForFields");
		
		let fields = Wprr.objectPath(this.item, "editedItem.linkedItem.fields");
		
		let editorIds = new Array();
		
		let currentArray = fields.names;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			
			let field = fields.getLinkByName(currentName);
			
			let fieldEditor = Wprr.utils.data.multitypeitems.controllers.admin.FieldEditor.create(this.item.group.createInternalItem(), field.id);
			fieldEditor.item.setValue("name", currentName);
			editorIds.push(fieldEditor.item.id);
		}
		
		this.item.getType("editorsGroup").addEditors(editorIds);
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
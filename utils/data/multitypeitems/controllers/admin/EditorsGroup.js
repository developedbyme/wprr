import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class EditorsGroup extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._editorAddedCommand = Wprr.commands.callFunction(this, this._editorAdded, [Wprr.sourceEvent()]);
		this._editorRemovedCommand = Wprr.commands.callFunction(this, this._editorRemoved, [Wprr.sourceEvent()]);
		
		this._hasChangesUpdateCommand = Wprr.commands.callFunction(this, this._hasChangesUpdate);
		
		this._changeCommandsNode = null;
		
		this._saveDataFieldCommand = Wprr.commands.callFunction(this, this._saveDataField, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
		this._saveFieldCommand = Wprr.commands.callFunction(this, this._saveField, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
	}
	
	setup() {
		
		this.item.addType("editorsGroup", this);
		this.item.addType("saveDataController", this);
		this.item.getNamedLinks("allEditors");
		
		let editors = this.item.getLinks("editors");
		
		this.item.requireValue("changed", false);
		
		this._changeCommandsNode = Wprr.utils.data.nodes.ArrayChangeCommands.connect(editors.idsSource, this._editorAddedCommand, this._editorRemovedCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		
		this.setup();
		
		return this;
	}
	
	getItemEditor(aId) {
		let linkName = "item" + aId;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ItemEditor.create(items.createInternalItem(), aId);
			newEditor.item.addSingleLink("editorsGroup", this.item.id);
			editors.addItem(linkName, newEditor.item.id);
			
		}
		
		return editors.getLinkByName(linkName).getType("itemEditor");
	}
	
	getFieldEditor(aId, aName) {
		console.log("getFieldEditor");
		console.log(aId, aName);
		
		let linkName = "field" + aId + "-" + aName;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			let field = Wprr.objectPath(item, "fields." + aName);
			
			let value = null;
			if(field) {
				value = field.getValue("value");
			}
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			if(field) {
				newEditorItem.addSingleLink("field", field.id);
				field.getType("value").connectSource(newEditorItem.getType("storedValue"));
			}
			newEditorItem.setValue("name", aName);
			
			newEditorItem.setValue("saveCommands", [this._saveDataFieldCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getCustomPathFieldEditor(aId, aName, aValuePath) {
		console.log("getCustomPathFieldEditor");
		console.log(aId, aName);
		
		let linkName = "field" + aId + "-" + aName;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			
			
			let value = item.getValue(aValuePath);
			
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			item.getValueSource(aValuePath).connectSource(newEditorItem.getType("storedValue"));
			
			newEditorItem.setValue("name", aName);
			
			newEditorItem.setValue("saveCommands", [this._saveDataFieldCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getPostStatusEditor(aId) {
		console.log("getPostStatusEditor");
		console.log(aId);
		
		let linkName = "postStatus" + aId;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			
			
			let value = item.getValue("postStatus");
			
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			item.getValueSource("postStatus").connectSource(newEditorItem.getType("storedValue"));
			
			newEditorItem.setValue("name", "status");
			
			newEditorItem.setValue("saveCommands", [this._saveFieldCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getRelationEditor(aId, aDirection, aConnectionType, aItemType) {
		let linkName = "relation" + aId + "-" + aDirection + "-" + aConnectionType + "-" + aItemType;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.RelationEditor.create(items.createInternalItem());
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditor.setupSelection(aId, aDirection, aConnectionType, aItemType);
			
			editors.addItem(linkName, newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("relationEditor");
	}
	
	addEditor(aId) {
		this.item.getLinks("editors").addUniqueItem(aId);
		
		return this;
	}
	
	addEditors(aIds) {
		this.item.getLinks("editors").addUniqueItems(aIds);
		
		return this;
	}
	
	_editorAdded(aId) {
		//console.log("_editorAdded");
		//console.log(aId);
		
		let item = this.item.group.getItem(aId);
		
		item.requireValue("changed", false).getType("changed").addChangeCommand(this._hasChangesUpdateCommand);
	}
	
	_editorRemoved(aId) {
		//console.log("_editorRemoved");
		
		let item = this.item.group.getItem(aId);
		
		item.requireValue("changed", false).getType("changed").removeChangeCommand(this._hasChangesUpdateCommand);
	}
	
	_hasChangesUpdate() {
		//console.log("_hasChangesUpdate");
		
		let changedValues = Wprr.objectPath(this.item, "editors.items.(every).changed.value");
		
		let hasChange = changedValues.indexOf(true) !== -1;
		this.item.setValue("changed", hasChange);
	}
	
	save() {
		console.log("save");
		let saveOperation = Wprr.utils.data.multitypeitems.controllers.admin.SaveOperation.create(this.item.group.createInternalItem());
		console.log(saveOperation);
		
		this.getSaveData(saveOperation);
		
		//METODO: add to statuses
		
		saveOperation.load();
	}
	
	getSaveData(aSaveOperation) {
		//console.log("getSaveData");
		
		if(this.item.getValue("changed")) {
			let currentArray = Wprr.objectPath(this.item, "editors.items.(every).saveDataController");
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentEditor = currentArray[i];
				currentEditor.getSaveData(aSaveOperation);
			}
		}
	}
	
	toJSON() {
		return "[EditorsGroup id=" + this._id + "]";
	}
	
	_saveDataField(aItem, aSaveOperation) {
		console.log("_saveField");
		console.log(aItem, aSaveOperation);
		
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		let comment = aItem.getValue("comment");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.setDataField(aItem.getValue("name"), value, comment);
		
		let editor = aItem.getType("valueEditor");
		editLoader.addSuccessCommand(Wprr.commands.callFunction(editor, editor.saved, [value]));
	}
	
	_saveField(aItem, aSaveOperation) {
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		let comment = aItem.getValue("comment");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.setField(aItem.getValue("name"), value, comment);
		
		let editor = aItem.getType("valueEditor");
		editLoader.addSuccessCommand(Wprr.commands.callFunction(editor, editor.saved, [value]));
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		//console.log("EditorsGroup::getValueForPath");
		//console.log(aPath);
		
		let tempArray = (""+aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "itemEditor":
				let itemId = tempArray.shift();
				restParts = tempArray.join(".");
				return Wprr.objectPath(this.getItemEditor(itemId), restParts);
		}
		
		return Wprr.objectPath(this[firstPart], restParts);
	}
	
	static create(aItem) {
		let newEditorsGroup = new EditorsGroup();
		
		newEditorsGroup.setupForItem(aItem);
		
		return newEditorsGroup;
	}
}
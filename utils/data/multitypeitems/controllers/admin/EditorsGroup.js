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
		this._saveRelationFieldCommand = Wprr.commands.callFunction(this, this._saveRelationField, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
		this._saveFieldCommand = Wprr.commands.callFunction(this, this._saveField, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
		this._saveMetaFieldCommand = Wprr.commands.callFunction(this, this._saveMetaField, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
		this._saveOrderCommand = Wprr.commands.callFunction(this, this._saveOrder, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
		this._saveFieldTranslationsCommand = Wprr.commands.callFunction(this, this._saveFieldTranslations, [Wprr.sourceEvent("item"), Wprr.sourceEvent("saveOperation")]);
		
	}
	
	setup() {
		
		this.item.addType("editorsGroup", this);
		this.item.addType("saveDataController", this);
		this.item.getNamedLinks("allEditors");
		this.item.requireSingleLink("parent");
		this.item.requireValue("progressItems", []);
		this.item.requireValue("isInProgress", false);
		
		let progressLength = this.item.addNode("progressLength", new Wprr.utils.data.nodes.GetProperty());
		progressLength.sources.get("object").input(this.item.getValueSource("progressItems"));
		progressLength.propertyPath = "length";
		
		let progressCompare = this.item.addNode("progressCompare", new Wprr.utils.data.nodes.logic.Compare());
		
		progressCompare.sources.get("input1").input(progressLength.sources.get("value"));
		progressCompare.operation = ">";
		progressCompare.input2 = 0;
		this.item.getValueSource("isInProgress").input(progressCompare.sources.get("output"));
		
		
		let editors = this.item.getLinks("editors");
		
		this.item.requireValue("changed", false);
		
		this._changeCommandsNode = Wprr.utils.data.nodes.ArrayChangeCommands.connect(editors.idsSource, this._editorAddedCommand, this._editorRemovedCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		
		this.setup();
		
		return this;
	}
	
	setParent(aId) {
		this.item.addSingleLink("parent", aId);
		
		return this;
	}
	
	getItemEditor(aId) {
		//console.log("getItemEditor");
		//console.log(aId);
		
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
		//console.log("getFieldEditor");
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
	
	getRelationFieldEditor(aId, aName) {
		let linkName = "field" + aId + "-" + aName;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			
			let value = item.getValue(aName);
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			item.getValueSource(aName).connectSource(newEditorItem.getType("storedValue"));
			
			newEditorItem.setValue("name", aName);
			
			newEditorItem.setValue("saveCommands", [this._saveRelationFieldCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getTranslationsEditor(aId, aFieldName) {
		let linkName = "fieldTranslations" + aId + "-" + aFieldName;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			
			let value = {};
			
			//METODO: default value
			let item = this.item.group.getItem(aId);
			
			let fieldTranslation = Wprr.objectPath(item, "fieldsTranslations." + aFieldName);
			if(fieldTranslation) {
				let storedValue = fieldTranslation.getValue("value");
				if(storedValue) {
					value = storedValue;
				}
			}
			
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.TranslationsEditor.create(this.item.group.createInternalItem(), value);
			let newEditorItem = newEditor.item;
			
			newEditorItem.addSingleLink("editedItem", aId);
			newEditorItem.setValue("name", aFieldName);
			
			newEditorItem.setValue("saveCommands", [this._saveFieldTranslationsCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getCustomPathFieldEditor(aId, aName, aValuePath) {
		//console.log("getCustomPathFieldEditor");
		//console.log(aId, aName);
		
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
		//console.log("getPostStatusEditor");
		//console.log(aId);
		
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
	
	getTitleEditor(aId) {
		//console.log("getTitleEditor");
		//console.log(aId);
		
		let linkName = "title" + aId;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			
			let value = item.getValue("title");
			
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			item.getValueSource("content").connectSource(newEditorItem.getType("storedValue"));
			
			newEditorItem.setValue("name", "title");
			
			newEditorItem.setValue("saveCommands", [this._saveFieldCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getContentEditor(aId) {
		//console.log("getContentEditor");
		//console.log(aId);
		
		let linkName = "content" + aId;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			
			let value = item.getValue("content");
			
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			item.getValueSource("content").connectSource(newEditorItem.getType("storedValue"));
			
			newEditorItem.setValue("name", "content");
			
			newEditorItem.setValue("saveCommands", [this._saveFieldCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
		}
		
		return editors.getLinkByName(linkName).getType("valueEditor");
	}
	
	getMetaEditor(aId, aMetaKey, aFieldName = null) {
		//console.log("getMetaEditor");
		//console.log(aId);
		
		let linkName = "meta" + aId + "-" + aMetaKey;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			
			let fieldName = aFieldName ? aFieldName : aMetaKey;
			
			let value = item.getValue(fieldName);
			
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.ValueEditor.create(items.createInternalItem(), value);
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditorItem.addSingleLink("editedItem", aId);
			
			item.getValueSource(fieldName).connectSource(newEditorItem.getType("storedValue"));
			
			newEditorItem.setValue("name", aMetaKey);
			
			newEditorItem.setValue("saveCommands", [this._saveMetaFieldCommand]);
			
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
	
	getOrderEditor(aId, aForType) {
		let linkName = "order" + aId + "-" + aForType;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.OrderEditor.create(items.createInternalItem());
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditor.setupSelection(aId, aForType);
			
			newEditorItem.setValue("saveCommands", [this._saveOrderCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
			
			newEditor.setupInitialValue(item);
		}
		
		return editors.getLinkByName(linkName).getType("orderEditor");
	}
	
	getHierarchyOrderEditor(aId, aForType) {
		let linkName = "hierarchy-order" + aId + "-" + aForType;
		let editors = this.item.getNamedLinks("allEditors");
		
		if(!editors.hasLinkByName(linkName)) {
			let items = this.item.group;
			
			let item = items.getItem(aId);
			let newEditor = Wprr.utils.data.multitypeitems.controllers.admin.HierarchyOrderEditor.create(items.createInternalItem());
			
			let newEditorItem = newEditor.item;
			newEditorItem.addSingleLink("editorsGroup", this.item.id);
			newEditor.setupSelection(aId, aForType);
			
			newEditorItem.setValue("saveCommands", [this._saveOrderCommand]);
			
			editors.addItem(linkName, newEditorItem.id);
			this.addEditor(newEditorItem.id);
			
			newEditor.setupInitialValue(item);
		}
		
		return editors.getLinkByName(linkName).getType("orderEditor");
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
		
		let parentEditor = Wprr.objectPath(this.item, "parent.linkedItem");
		if(parentEditor) {
			parentEditor.getLinks("editors").addUniqueItem(aId);
		}
	}
	
	_editorRemoved(aId) {
		//console.log("_editorRemoved");
		
		let item = this.item.group.getItem(aId);
		
		item.requireValue("changed", false).getType("changed").removeChangeCommand(this._hasChangesUpdateCommand);
		
		let parentEditor = Wprr.objectPath(this.item, "parent.linkedItem");
		if(parentEditor) {
			parentEditor.getLinks("editors").removeItem(aId);
		}
	}
	
	_hasChangesUpdate() {
		//console.log("_hasChangesUpdate");
		
		let changedValues = Wprr.objectPath(this.item, "editors.items.(every).changed.value");
		
		let hasChange = changedValues.indexOf(true) !== -1;
		this.item.setValue("changed", hasChange);
	}
	
	save() {
		//console.log("save");
		let saveOperation = Wprr.utils.data.multitypeitems.controllers.admin.SaveOperation.create(this.item.group.createInternalItem());
		
		this.getSaveData(saveOperation);
		
		//METODO: add to statuses
		
		saveOperation.load();
		
		return saveOperation;
	}
	
	saveItemById(aId) {
		
		let saveOperation = Wprr.utils.data.multitypeitems.controllers.admin.SaveOperation.create(this.item.group.createInternalItem());
		
		let items = this.getItemEditor(aId).item.getNamedLinks("fieldEditors").items;
		this.getSaveDataForItems(items, saveOperation);
		
		//METODO: add to statuses
		
		saveOperation.load();
		
		return saveOperation;
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
	
	getSaveDataForItems(aItems, aSaveOperation) {
		let currentArray = Wprr.objectPath(aItems, "(every).saveDataController");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentEditor = currentArray[i];
			currentEditor.getSaveData(aSaveOperation);
		}
	}
	
	saveEditor(aEditor) {
		let saveOperation = Wprr.utils.data.multitypeitems.controllers.admin.SaveOperation.create(this.item.group.createInternalItem());
		aEditor.getSaveData(saveOperation);
		saveOperation.load();
	}
	
	toJSON() {
		return "[EditorsGroup id=" + this._id + "]";
	}
	
	_saveDataField(aItem, aSaveOperation) {
		//console.log("_saveField");
		//console.log(aItem, aSaveOperation);
		
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		let comment = aItem.getValue("comment");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.setDataField(aItem.getValue("name"), value, comment);
		
		let editor = aItem.getType("valueEditor");
		editLoader.addSuccessCommand(Wprr.commands.callFunction(editor, editor.saved, [value]));
	}
	
	_saveRelationField(aItem, aSaveOperation) {
		//console.log("_saveRelationField");
		//console.log(aItem, aSaveOperation);
		
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.createChange("dbm/updateObjectRelationField", {"field": aItem.getValue("name"), "value": value});
		
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
	
	_saveMetaField(aItem, aSaveOperation) {
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		let comment = aItem.getValue("comment");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.setMeta(aItem.getValue("name"), value);
		//METODO: comment
		
		let editor = aItem.getType("valueEditor");
		editLoader.addSuccessCommand(Wprr.commands.callFunction(editor, editor.saved, [value]));
	}
	
	_saveOrder(aItem, aSaveOperation) {
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		let comment = aItem.getValue("comment");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.createChange("dbm/order", {"value": aItem.getValue("value"), "forType": aItem.getValue("forType")});
		
		let editor = aItem.getType("valueEditor");
		editLoader.addSuccessCommand(Wprr.commands.callFunction(editor, editor.saved, [value]));
	}
	
	_saveFieldTranslations(aItem, aSaveOperation) {
		let itemId = Wprr.objectPath(aItem, "editedItem.linkedItem.id");
		let value = aItem.getValue("value");
		
		let editLoader = aSaveOperation.getEditLoader(itemId);
		editLoader.changeData.createChange("dbmtc/setFieldTranslations", {"value": aItem.getValue("value"), "field": aItem.getValue("name")});
		
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
	
	addProgressLoader(aLoader) {
		
		aLoader.addSuccessCommand(Wprr.commands.callFunction(this, this.removeProgressItem, [aLoader]));
		
		let newProgressArray = this.item.getValue("progressItems").concat([aLoader]);
		this.item.setValue("progressItems", newProgressArray);
		
		return this;
	}
	
	removeProgressItem(aItem) {
		//console.log("removeProgressItem")
		
		let newProgressArray = this.item.getValue("progressItems");
		
		newProgressArray = Wprr.utils.array.removeValues(newProgressArray, [aItem]);
		
		this.item.setValue("progressItems", newProgressArray);
		
		return this;
	}
	
	static create(aItem) {
		let newEditorsGroup = new EditorsGroup();
		
		newEditorsGroup.setupForItem(aItem);
		
		return newEditorsGroup;
	}
}
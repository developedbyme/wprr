import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class RelationEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._relationAddedCommand = Wprr.commands.callFunction(this, this._relationAdded, [Wprr.sourceEvent()]);
		this._relationRemovedCommand = Wprr.commands.callFunction(this, this._relationRemoved, [Wprr.sourceEvent()]);
		
		this._changeCommandsNode = null;
	}
	
	setup() {
		
		this.item.requireSingleLink("editedItem");
		this.item.requireValue("direction");
		this.item.requireValue("objectTypeField", "from.linkedItem.objectTypes.ids");
		this.item.requireSingleLink("connectionType");
		this.item.requireSingleLink("itemType");
		
		this.item.getLinks("allRelations");
		this.item.getLinks("typedRelations");
		
		{
			let filter = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(this.item.group.createInternalItem());
			this.item.addSingleLink("connectionTypeFilter", filter.item.id);
			this.item.getLinks("allRelations").idsSource.connectSource(filter.item.getLinks("all").idsSource);
			
			{
				let filterPart = filter.addFieldCompare("type.id", null);
				this.item.getType("connectionType").idSource.connectSource(filterPart.getType("compareValue"));
			}
			{
				let filterPart = filter.addFieldCompare("from.linkedItem.objectTypes.ids", null, "arrayContains");
				this.item.getType("objectTypeField").connectSource(filterPart.getType("field"));
				this.item.getType("itemType").idSource.connectSource(filterPart.getType("compareValue"));
			}
			
			filter.item.getLinks("filtered").idsSource.connectSource(this.item.getLinks("typedRelations").idsSource);
		}
		
		
		let arrayChangeCommnads = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("typedRelations").idsSource, this._relationAddedCommand, this._relationRemovedCommand);
		
		this.item.addType("updateCommands", arrayChangeCommnads);
		
		this.item.getLinks("activeRelations");
		
		//METODO: add filter
		//METODO: add listeners
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("relationEditor", this);
		
		this.setup();
		
		return this;
	}
	
	setupSelection(aItemId, aDirection, aConnectionType, aItemType) {
		console.log("setupSelection");
		let item = this.item.group.getItem(aItemId);
		
		this.item.addSingleLink("editedItem", aItemId);
		this.item.setValue("direction", aDirection);
		
		this.item.addSingleLink("connectionType", "dbm_type:object-relation/" + aConnectionType);
		this.item.addSingleLink("itemType", "dbm_type:" + aItemType);
		
		let directedRelations = item.getType(aDirection + "Relations");
		directedRelations.idsSource.connectSource(this.item.getLinks("allRelations").idsSource);
		if(aDirection === "incoming") {
			this.item.setValue("objectTypeField", "from.linkedItem.objectTypes.ids");
		}
		else {
			this.item.setValue("objectTypeField", "to.linkedItem.objectTypes.ids");
		}
		
		return this;
	}
	
	_relationAdded(aId) {
		console.log("_relationAdded");
		console.log(aId, this);
		
		if(aId) {
			let editorGroup = Wprr.objectPath(this.item, "editorsGroup.linkedItem.editorsGroup");
			let itemEditor = editorGroup.getItemEditor(aId);
			console.log(itemEditor);
			
			itemEditor.getFieldEditor("startAt");
			itemEditor.getFieldEditor("endAt");
			
			
			//METODO: this needs a changed field
		}
	}
	
	_relationRemoved(aId) {
		console.log("_relationRemoved");
		
		if(aId) {
			
		}
		
	}
	
	toJSON() {
		return "[RelationEditor id=" + this._id + "]";
	}
	
	static create(aItem) {
		//console.log("RelationEditor::create");
		let newRelationEditor = new RelationEditor();
		
		newRelationEditor.setupForItem(aItem);
		
		return newRelationEditor;
	}
}
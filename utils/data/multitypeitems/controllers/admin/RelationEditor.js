import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";
import SingleRelationEditor from "./SingleRelationEditor";

export default class RelationEditor extends MultiTypeItemConnection {
	
	constructor() {
		//console.log("RelationEditor::constructor");
		
		super();
		
		this._relationAddedCommand = Wprr.commands.callFunction(this, this._relationAdded, [Wprr.sourceEvent()]);
		this._relationRemovedCommand = Wprr.commands.callFunction(this, this._relationRemoved, [Wprr.sourceEvent()]);
		this._updateActiveFilterCommand = Wprr.commands.callFunction(this, this._updateActiveFilter);
		
		this._changeCommandsNode = null;
		
		this._filterActiveRelationsBound = this._filterActiveRelations.bind(this);
	}
	
	get singleEditor() {
		if(!this.item.hasType("singleEditor")) {
			let singleEditor = this.item.addNode("singleEditor", new SingleRelationEditor());
			singleEditor.item.addSingleLink("relationEditor", this.item.id);
			singleEditor.item.getLinks("activeRelations").input(this.item.getLinks("activeRelations"));
		}
		
		return Wprr.objectPath(this.item, "singleEditor.linkedItem.controller");
	}
	
	_filterActiveRelations(aItems) {
		//console.log("_filterActiveRelations");
		
		let currentTime = moment().unix();
		let editorsGroup = Wprr.objectPath(this.item, "editorsGroup.linkedItem.editorsGroup");
		
		let returnArray = new Array();
		let currentArray = aItems;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let currentItemEditor = editorsGroup.getItemEditor(currentItem.id);
			
			let startAt = currentItemEditor.getFieldEditor("startAt").value;
			let endAt = currentItemEditor.getFieldEditor("endAt").value;
			
			if((startAt === -1 || startAt <= currentTime) && (endAt === -1 || endAt > currentTime)) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
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
			filter.item.getLinks("all").input(this.item.getLinks("allRelations"));
			
			{
				let filterPart = filter.addFieldCompare("type.id", null);
				this.item.getType("connectionType").idSource.connectSource(filterPart.getType("compareValue"));
			}
			{
				let filterPart = filter.addFieldCompare("from.linkedItem.objectTypes.ids", null, "arrayContains");
				this.item.getType("objectTypeField").connectSource(filterPart.getType("field"));
				this.item.getType("itemType").idSource.connectSource(filterPart.getType("compareValue"));
			}
			
			this.item.getLinks("typedRelations").input(filter.item.getLinks("filtered"));
		}
		
		
		let arrayChangeCommnads = Wprr.utils.data.nodes.ArrayChangeCommands.connect(this.item.getLinks("typedRelations").idsSource, this._relationAddedCommand, this._relationRemovedCommand);
		
		this.item.addType("updateCommands", arrayChangeCommnads);
		
		
		{
			let activeFilter = this.item.addNode("activeFilter", new Wprr.utils.data.multitypeitems.controllers.list.FilteredList());
			activeFilter.item.getLinks("all").input(this.item.getLinks("typedRelations"));
			
			{
				let filterPart = activeFilter.addFilterFunction(this._filterActiveRelationsBound);
			}
			
			this.item.getLinks("activeRelations").input(activeFilter.item.getLinks("filtered"));
		}
		
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
		
		let directedRelations = item.getLinks(aDirection + "Relations");
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
		//console.log("_relationAdded");
		//console.log(aId, this);
		
		if(aId) {
			let editorGroup = Wprr.objectPath(this.item, "editorsGroup.linkedItem.editorsGroup");
			let itemEditor = editorGroup.getItemEditor(aId);
			
			{
				let valueEditor = itemEditor.getCustomPathFieldEditor("startAt", "startAt");
				valueEditor.valueSource.addChangeCommand(this._updateActiveFilterCommand);
			}
			
			{
				let valueEditor = itemEditor.getCustomPathFieldEditor("endAt", "endAt");
				valueEditor.valueSource.addChangeCommand(this._updateActiveFilterCommand);
			}
		}
	}
	
	_relationRemoved(aId) {
		console.log("_relationRemoved");
		
		if(aId) {
			
		}
		
	}
	
	_updateActiveFilter() {
		//console.log("_updateActiveFilter");
		
		let filter = Wprr.objectPath(this.item, "activeFilter.linkedItem.controller");
		
		filter.updateFilter();
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
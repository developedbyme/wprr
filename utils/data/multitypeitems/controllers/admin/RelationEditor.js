import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";
import SingleRelationEditor from "./SingleRelationEditor";
import MultipleRelationsEditor from "./MultipleRelationsEditor";

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
	
	get multipleEditor() {
		if(!this.item.hasType("multipleEditor")) {
			let singleEditor = this.item.addNode("multipleEditor", new MultipleRelationsEditor());
			singleEditor.item.addSingleLink("relationEditor", this.item.id);
			singleEditor.item.getLinks("activeRelations").input(this.item.getLinks("activeRelations"));
		}
		
		return Wprr.objectPath(this.item, "multipleEditor.linkedItem.controller");
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
			let filter = this.item.addNode("connectionTypeFilter", new Wprr.utils.data.multitypeitems.controllers.list.FilteredList());
			
			filter.item.getLinks("all").input(this.item.getLinks("allRelations"));
			
			{
				let filterPart = filter.addFieldCompare("type.id", null);
				this.item.getType("connectionType").idSource.connectSource(filterPart.getType("compareValue"));
			}
			{
				let filterPart = filter.addFieldCompare("from.linkedItem.objectTypes.ids", null, "arrayContains");
				this.item.getType("objectTypeField").connectSource(filterPart.getType("field"));
				this.item.getType("itemType").idSource.connectSource(filterPart.getType("compareValue"));
				filterPart.getValueSource("active").input(this.item.getType("itemType").idSource);
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
		//console.log("setupSelection");
		let item = this.item.group.getItem(aItemId);
		
		this.item.addSingleLink("editedItem", aItemId);
		this.item.setValue("direction", aDirection);
		
		this.item.addSingleLink("connectionType", "dbm_type:object-relation/" + aConnectionType);
		if(aItemType !== "*") {
			this.item.addSingleLink("itemType", "dbm_type:" + aItemType);
		}
		
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
		//console.log("_relationRemoved");
		
		if(aId) {
			//METODO
		}
		
	}
	
	_updateActiveFilter() {
		//console.log("_updateActiveFilter");
		
		let filter = Wprr.objectPath(this.item, "activeFilter.linkedItem.controller");
		
		filter.updateFilter();
	}
	
	createRelation(aRelatedItemId) {
		let project = Wprr.objectPath(this.item.group, "project.controller");
		
		let baseObjectId = Wprr.objectPath(this.item, "editedItem.id"); 
		let direction = Wprr.objectPath(this.item, "direction.value");
		let connectionType = Wprr.objectPath(this.item, "connectionType.id").split("/").pop(); 
		
		let loader = project.getEditLoader(baseObjectId);
		if(direction === "incoming") {
			loader.changeData.addIncomingRelation(aRelatedItemId, connectionType, false);
		}
		else if(direction === "outgoing") {
			loader.changeData.addOutgoingRelation(aRelatedItemId, connectionType, false);
		}
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._relationCreated, [aRelatedItemId, Wprr.sourceEvent("data.relationId")]));
		
		loader.load();
	}
	
	_relationCreated(aId, aRelationId) {
		//console.log("_relationCreated");
		//console.log(aId, aRelationId);
		
		let itemId = Wprr.objectPath(this.item, "editedItem.id");
		let direction = Wprr.objectPath(this.item, "direction.value");
		
		let newItem = this.item.group.getItem(aId);
		let relationItem = this.item.group.getItem(aRelationId);
		let item = this.item.group.getItem(itemId);
		
		let connectionType = Wprr.objectPath(this.item, "connectionType.id");
		relationItem.addSingleLink("type", connectionType);
		
		relationItem.setValue("startAt", moment().unix());
		relationItem.setValue("endAt", -1);
		relationItem.setValue("postStatus", "draft");
		
		if(direction === "incoming") {
			relationItem.addSingleLink("from", newItem.id);
			relationItem.addSingleLink("to", item.id);
			
			newItem.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
			
			item.getLinks("incomingRelations").addUniqueItem(relationItem.id);
		}
		else {
			relationItem.addSingleLink("to", newItem.id);
			relationItem.addSingleLink("from", item.id);
			
			newItem.getLinks("incomingRelations").addUniqueItem(relationItem.id);
			
			item.getLinks("outgoingRelations").addUniqueItem(relationItem.id);
		}
		
		let editorsGroup = Wprr.objectPath(this.item, "editorsGroup.linkedItem.editorsGroup");
		
		let postStatusEditor = editorsGroup.getItemEditor(relationItem.id).getPostStatusEditor();
		
		postStatusEditor.item.setValue("value", "private");
		
	}
	
	endRelation(aRelationId) {
		//console.log("endRelation");
		//console.log(aRelationId);
		
		let editorsGroup = Wprr.objectPath(this.item, "editorsGroup.linkedItem.editorsGroup");
		let fieldEditor = editorsGroup.getItemEditor(aRelationId).getFieldEditor("endAt");
		
		let currentTime = moment().unix();
		
		let endTime = fieldEditor.value;
		if(endTime === -1 || endTime > currentTime) {
			fieldEditor.valueSource.value = currentTime;
		}
		
		return this;
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
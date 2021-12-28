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
	}
	
	setup() {
		
		let editors = this.item.getLinks("editors");
		
		this.item.requireValue("changed", false);
		
		this._changeCommandsNode = Wprr.utils.data.nodes.ArrayChangeCommands.connect(editors.idsSource, this._editorAddedCommand, this._editorRemovedCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("editorsGroup", this);
		aItem.addType("saveDataController", this);
		this.setup();
		
		return this;
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
		
		let saveOperation = Wprr.utils.data.multitypeitems.controllers.admin.SaveOperation.create(this.item.group.createInternalItem());
		
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
	
	static create(aItem) {
		let newEditorsGroup = new EditorsGroup();
		
		newEditorsGroup.setupForItem(aItem);
		
		return newEditorsGroup;
	}
}
import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class FieldEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._fieldAddedCommand = Wprr.commands.callFunction(this, this._fieldAdded, [Wprr.sourceEvent()]);
		this._fieldRemovedCommand = Wprr.commands.callFunction(this, this._fieldRemoved, [Wprr.sourceEvent()]);
		
		this._changeCommandsNode = null;
	}
	
	setup() {
		
		this.item.requireValue("name");
		this.item.requireSingleLink("field");
		this.item.requireValue("changed");
		
		this._changeCommandsNode = Wprr.utils.data.nodes.ValueChangeCommands.connect(this.item.getType("field").idSource, this._fieldAddedCommand, this._fieldRemovedCommand);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("fieldEditor", this);
		aItem.addType("saveDataController", this);
		this.setup();
		
		return this;
	}
	
	_fieldAdded(aId) {
		//console.log("_fieldAdded");
		//console.log(aId);
		
		if(aId) {
			let item = this.item.group.getItem(aId);
		
			item.requireValue("changed", false).getType("changed").connectSource(this.item.getType("changed"));
		}
	}
	
	_fieldRemoved(aId) {
		//console.log("_fieldRemoved");
		
		if(aId) {
			let item = this.item.group.getItem(aId);
		
			item.requireValue("changed", false).getType("changed").disconnectSource(this.item.getType("changed"));
		}
		
	}
	
	save() {
		//METODO
	}
	
	saved(aSavedValue) {
		//console.log("saved");
		//console.log(aSavedValue);
		
		this.item.getType("field").linkedItem.getType("storedValue").value = aSavedValue;
	}
	
	getSaveData(aSaveOperation) {
		//console.log("FieldEditor::getSaveData");
		
		if(this.item.getValue("changed")) {
			
			let itemId = Wprr.objectPath(this.item, "field.linkedItem.for.id");
			
			let value = this.item.getType("field").linkedItem.getValue("value");
			let comment = null;
			
			let editLoader = aSaveOperation.getEditLoader(itemId);
			editLoader.changeData.setDataField(this.item.getValue("name"), value, comment);
			
			editLoader.addSuccessCommand(Wprr.commands.callFunction(this, this.saved, [value]));
		}
	}
	
	toJSON() {
		return "[FieldEditor id=" + this._id + "]";
	}
	
	static create(aItem, aFieldId = 0) {
		//console.log("FieldEditor::create");
		let newFieldEditor = new FieldEditor();
		
		newFieldEditor.setupForItem(aItem);
		if(aFieldId) {
			aItem.addSingleLink("field", aFieldId);
		}
		
		return newFieldEditor;
	}
}
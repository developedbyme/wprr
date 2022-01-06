import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ValueEditor extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.requireValue("comment", null);
		this.item.requireValue("saveCommands", []);
		this.item.requireValue("value");
		
		this._value = this.item.getType("value");
		this._value.makeStorable();
		
		this.item.addType("storedValue", this._value.sources.get("storedValue"));
		this.item.addType("changed", this._value.sources.get("changed"));
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("valueEditor", this);
		aItem.addType("saveDataController", this);
		this.setup();
		
		return this;
	}
	
	save() {
		//METODO
	}
	
	saved(aSavedValue) {
		console.log("saved");
		console.log(aSavedValue);
		
		this.item.getType("storedValue").value = aSavedValue;
	}
	
	getSaveData(aSaveOperation) {
		//console.log("ValueEditor::getSaveData");
		
		if(this.item.getValue("changed")) {
			
			let saveCommands = this.item.getValue("saveCommands");
			
			Wprr.utils.CommandPerformer.perform(saveCommands, {"item": this.item, "saveOperation": aSaveOperation}, null);
			
		}
	}
	
	toJSON() {
		return "[ValueEditor id=" + this._id + "]";
	}
	
	static create(aItem, aValue = null) {
		//console.log("ValueEditor::create");
		let newValueEditor = new ValueEditor();
		
		newValueEditor.setupForItem(aItem);
		aItem.setValue("value", aValue);
		aItem.setValue("storedValue", aValue);
		
		return newValueEditor;
	}
}
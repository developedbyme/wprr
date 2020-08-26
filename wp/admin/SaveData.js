import React from 'react';
import Wprr from "wprr/Wprr";

import ChangeData from "wprr/wp/admin/ChangeData";

//import SaveData from "wprr/wp/admin/SaveData";
export default class SaveData {

	constructor() {
		
		this._changes = new ChangeData();
		this._startCommands = new Array();
		this._savedCommands = new Array();
		this._id = null;
	}
	
	get id() {
		return this._id;
	}
	
	get changes() {
		return this._changes;
	}
	
	get startCommands() {
		return this._startCommands;
	}
	
	get savedCommands() {
		return this._savedCommands;
	}
	
	setId(aId) {
		this._id = aId;
		
		return  this;
	}
	
	addUpdateSavedFieldCommand(aFieldName, aExternalStorage) {
		this._savedCommands.push(Wprr.commands.setValue(aExternalStorage, "saved." + aFieldName, aExternalStorage.getValue(aFieldName)));
		
		return this;
	}
	
	static create(aId) {
		let newSaveData = new SaveData();
		
		newSaveData.setId(aId);
		
		return newSaveData;
	}
}

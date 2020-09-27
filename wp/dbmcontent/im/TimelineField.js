import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class TimelineField extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._messageGroup = null;
		
		this.key = null;
		this._value = null;
		this._changes = new Array();
		this._translations = new Object();
		this._lastValue = null;
		
		this._type = null;
		this._status = null;
		
		this._settings = new Object();
		
		this._externalStorage = null;
	}
	
	get type() {
		return this._type;
	}
	
	get value() {
		return this._value;
	}
	
	get asTerm() {
		//console.log("asTerm");
		
		if(!this._value) {
			return this._value;
		}
		
		if(Number.isInteger(this._value)) {
			let termName = "term" + this._value;
			return this.item.group.getItem(termName);
		}
		else {
			let taxonomy = "dbm_relation"; //METODO: set taxonomy based on type
			let taxonomyItem = this.item.group.getItem("taxonomy-" + taxonomy);
			
			let returnObject = Wprr.objectPath(taxonomyItem, "termBySlug." + this._value);
			return returnObject;
		}
		
	}
	
	get status() {
		return this._status;
	}
	
	get externalStorage() {
		return this._externalStorage;
	}
	
	setupEditStorage() {
		let editStrorage = new Wprr.utils.DataStorage();
		
		this.item.addType("editStorage", editStrorage);
		this.connectToEditStorage(editStrorage);
		
		return this;
	}
	
	connectToEditStorage(aExternalStorage) {
		//console.log("TimelineField::connectToEditStorage");
		//console.log(aExternalStorage);
		
		this._externalStorage = aExternalStorage;
		this._externalStorage.addOwner(this);
		
		this._lastValue = JSON.stringify(this._value);
		
		if(this._value !== undefined) {
			this._externalStorage.updateValue("value", Wprr.utils.object.copyViaJson(this._value));
			this._externalStorage.updateValue("saved.value", Wprr.utils.object.copyViaJson(this._value));
		}
		
		this._externalStorage.updateValue("translations", Wprr.utils.object.copyViaJson(this._translations));
		this._externalStorage.updateValue("saved.translations", Wprr.utils.object.copyViaJson(this._translations));
		
		this._externalStorage.updateValue("timeline", Wprr.utils.object.copyViaJson(this._changes));
		this._externalStorage.updateValue("saved.timeline", Wprr.utils.object.copyViaJson(this._changes));
		
		this._externalStorage.updateValue("uiState.status", "normal");
		
		return this;
	}
	
	_updateExternalStorage(aName, aValue) {
		//console.log("TimelineField::_updateExternalStorage");
		
		if(this._externalStorage) {
			this._externalStorage.updateValue(aName, aValue);
		}
	}
	
	flagAsSaving() {
		if(this._externalStorage) {
			this._externalStorage.updateValue("uiState.status", "saving");
		}
	}
	
	updateSavedValues() {
		
		if(this._externalStorage) {
			this._externalStorage.updateValue("saved.value", Wprr.utils.object.copyViaJson(this._value));
			this._externalStorage.updateValue("saved.translations", Wprr.utils.object.copyViaJson(this._translations));
			this._externalStorage.updateValue("saved.timeline", Wprr.utils.object.copyViaJson(this._changes));
		}
		
		this.flagAsSaved();
	}
	
	flagAsSaved() {
		if(this._externalStorage) {
			this._externalStorage.updateValue("uiState.status", "normal");
			this._externalStorage.updateValue("uiState.workMode", "display");
		}
	}
	
	hasUnsavedChange() {
		if(this._externalStorage) {
			let savedValue = this._externalStorage.getValue("saved.value");
			//let savedTimeline = this._externalStorage.getValue("timeline");
			//let savedTranslations = this._externalStorage.getValue("translations");
			
			if(JSON.stringify(this._value) !== JSON.stringify(savedValue)) {
				return true;
			}
			
			return false;
		}
		
		console.warn("No external storage, can't compare changes", this);
		return true;
	}
	
	getSaveData(aComment = null) {
		let changeData = new Wprr.utils.ChangeData();
		changeData.createChange("dbmtc/setField", {"field": this.key, "value": this._value, "comment": aComment});
		
		return changeData;
	}
	
	externalDataChange() {
		//console.log("TimelineField::externalDataChange");
		
		let lastValue = this._value;
		let value = this._externalStorage.getValue("value");
		if(value !== undefined) {
			this._value = value;
		}
		let timeline = this._externalStorage.getValue("timeline");
		if(timeline) {
			this._changes = timeline;
		}
		let translations = this._externalStorage.getValue("translations");
		if(translations) {
			this._translations = translations;
		}
		
		let stringValue = JSON.stringify(value);
		if(value !== undefined && this._lastValue !== stringValue) {
			if(this._messageGroup) {
				this._messageGroup.fieldChanged(this);
			}
			this._lastValue = stringValue;
		}
	}
	
	setMessageGroup(aMessageGroup) {
		this._messageGroup = aMessageGroup;
		
		return this;
	}
	
	setValue(aValue) {
		this._value = aValue;
		this._updateExternalStorage("value", aValue);
		
		return this;
	}
	
	setTranslations(aTranslations) {
		let copiedObject = Wprr.utils.object.copyViaJson(aTranslations);
		this._translations = copiedObject;
		this._updateExternalStorage("translations", copiedObject);
		
		return this;
	}
	
	updateValue(aValue) {
		this.setValue(aValue);
		
		return this;
	}
	
	getValue() {
		return this._value;
	}
	
	getType() {
		return this._type;
	}
	
	setupChanges(aPastChanges, aFutureChanges) {
		let changes = new Array();
		if(aPastChanges) {
			changes = changes.concat(aPastChanges);
		}
		
		if(aFutureChanges) {
			changes = changes.concat(aFutureChanges);
		}
		
		this._changes = changes;
		
		return this;
	}
	
	setupField(aKey, aType, aStatus, aSettings) {
		this.key = aKey;
		this._type = aType;
		this._status = aStatus;
		
		if(aSettings) {
			this._settings = Wprr.utils.object.copyViaJson(aSettings);
		}
		
		return this;
	}
	
	setupTranslations(aTranslations) {
		this._translations = Wprr.utils.object.copyViaJson(aSettings);
		
		return this;
	}
	
	setValueAt(aValue, aTime) {
		//METODO
		
		return this;
	}
	
	addToSaveData(aSaveData) {
		
		if(this.hasUnsavedChange()) {
			aSaveData.changes.setDataField(this.key, this._value);
		
			aSaveData.addUpdateSavedFieldCommand("value", this._externalStorage);
		
			let statusName = "uiState.status";
			aSaveData.startCommands.push(Wprr.commands.setValue(this._externalStorage, statusName, "saving"));
			aSaveData.savedCommands.push(Wprr.commands.setValue(this._externalStorage, statusName, "normal"));
			aSaveData.errorCommands.push(Wprr.commands.setValue(this._externalStorage, statusName, "normal"));
		
			let workModeName = "uiState.workMode";
			aSaveData.savedCommands.push(Wprr.commands.setValue(this._externalStorage, workModeName, "display"));
		}
	}
}
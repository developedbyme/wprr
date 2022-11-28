import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class TimelineField extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._messageGroup = null;
		
		this.key = null;
		this._changes = new Array();
		this._translations = new Object();
		this._lastValue = null;
		
		this._type = null;
		this._status = null;
		
		this._settings = new Object();
		
		this._externalStorage = null;
		
		let valueSource = this.createSource("value", null);
		valueSource.makeStorable();
		valueSource.sources.get("changed").addChangeCommand(Wprr.commands.callFunction(this, this._updateGroupForFieldChange));
	}
	
	get type() {
		return this._type;
	}
	
	get asTerm() {
		//console.log("asTerm");
		
		let value = this.value;
		if(!value) {
			return value;
		}
		
		if(Number.isInteger(value)) {
			let termName = "term" + value;
			return this.item.group.getItem(termName);
		}
		else {
			let taxonomy = "dbm_relation"; //METODO: set taxonomy based on type
			let taxonomyItem = this.item.group.getItem("taxonomy-" + taxonomy);
			
			let returnObject = Wprr.objectPath(taxonomyItem, "termBySlug." + value);
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
		
		let value = this.value;
		
		let valueSource = this.sources.get("value");
		
		if(value !== undefined) {
			this._externalStorage.updateValue("value", Wprr.utils.object.copyViaJson(value));
			this._externalStorage.updateValue("saved.value", Wprr.utils.object.copyViaJson(value));
		}
		
		valueSource.connectExternalStorage(this._externalStorage, "value");
		valueSource.sources.get("storedValue").connectExternalStorage(this._externalStorage, "saved.value");
		
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
		
		let valueSource = this.sources.get("value");
		valueSource.store();
		
		if(this._externalStorage) {
			//this._externalStorage.updateValue("saved.value", Wprr.utils.object.copyViaJson(this.value));
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
		
		let valueSource = this.sources.get("value");
		
		return valueSource.changed;
	}
	
	getSaveData(aComment = null) {
		let changeData = new Wprr.utils.ChangeData();
		changeData.createChange("dbmtc/setField", {"field": this.key, "value": this.value, "comment": aComment});
		
		return changeData;
	}
	
	externalDataChange() {
		//console.log("TimelineField::externalDataChange");
		
		let timeline = this._externalStorage.getValue("timeline");
		if(timeline) {
			this._changes = timeline;
		}
		let translations = this._externalStorage.getValue("translations");
		if(translations) {
			this._translations = translations;
		}
	}
	
	_updateGroupForFieldChange() {
		//console.log("TimelineField::_updateGroupForFieldChange");
		if(this._messageGroup) {
			this._messageGroup.fieldChanged(this);
		}
	}
	
	setMessageGroup(aMessageGroup) {
		this._messageGroup = aMessageGroup;
		
		return this;
	}
	
	setInitialValue(aValue) {
		
		this.sources.get("value").sources.get("storedValue")._value = Wprr.utils.object.tryCopyViaJson(aValue);
		this.setValue(aValue);
		
		return this;
	}
	
	setValue(aValue) {
		this.value = aValue;
		//this._updateExternalStorage("value", aValue);
		
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
		return this.value;
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
			aSaveData.changes.setDataField(this.key, this.value);
		
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
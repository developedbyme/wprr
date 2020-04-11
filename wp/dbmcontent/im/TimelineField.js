import Wprr from "wprr/Wprr";
import React from "react";

export default class TimelineField {
	
	constructor() {
		
		this._messageGroup = null;
		
		this.key = null;
		this._value = null;
		this._changes = new Array();
		this._translations = new Object();
		
		this._type = null;
		this._status = null;
		
		this._settings = new Object();
		
		this._externalStorage = null;
	}
	
	connectToEditStorage(aExternalStorage) {
		console.log("TimelineField::connectToEditStorage");
		console.log(aExternalStorage);
		
		this._externalStorage = aExternalStorage;
		this._externalStorage.addOwner(this);
		
		this._externalStorage.updateValue("saved.value", this._value);
		this._externalStorage.updateValue("value", this._value);
		
		this._externalStorage.updateValue("saved.translations", Wprr.utils.object.copyViaJson(this._translations));
		this._externalStorage.updateValue("translations", Wprr.utils.object.copyViaJson(this._translations));
		
		this._externalStorage.updateValue("saved.timeline", Wprr.utils.object.copyViaJson(this._changes));
		this._externalStorage.updateValue("timeline", Wprr.utils.object.copyViaJson(this._changes));
		
		this._externalStorage.updateValue("uiState.status", "normal");
		
		return this;
	}
	
	_updateExternalStorage(aName, aValue) {
		//console.log("TimelineField::_updateExternalStorage");
		
		if(this._externalStorage) {
			this._externalStorage.updateValue(aName, aValue);
		}
	}
	
	externalDataChange() {
		console.log("TimelineField::externalDataChange");
		
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
	}
	
	setMessageGroup(aMessageGroup) {
		this._messageGroup = aMessageGroup;
		
		return this;
	}
	
	setValue(aValue) {
		this._value = aValue;
		
		return this;
	}
	
	updateValue(aValue) {
		this.setValue(aValue);
		
		return this;
	}
	
	getValue() {
		return this._value;
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
}
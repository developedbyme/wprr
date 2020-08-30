import Wprr from "wprr/Wprr";
import React from "react";
import moment from "moment";

import objectPath from "object-path";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class Relation extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._id = 0;
		
		this._startAt = -1;
		this._endAt = -1;
		this._status = "draft";
	}
	
	setup(aData) {
		//console.log("Relation::setup");
		//console.log(aData);
		
		this.setId(aData["id"]);
		
		this._startAt = aData["startAt"];
		this._endAt = aData["endAt"];
		this._status = aData["status"];
		
		return this;
	}
	
	connectToEditStorage(aExternalStorage) {
		//console.log("TimelineField::connectToEditStorage");
		//console.log(aExternalStorage);
		
		this._externalStorage = this.item.getType("editStorage");
		this._externalStorage.addOwner(this);
		
		this._externalStorage.updateValue("saved.startAt", Wprr.utils.object.copyViaJson(this._startAt));
		this._externalStorage.updateValue("startAt", Wprr.utils.object.copyViaJson(this._startAt));
		
		this._externalStorage.updateValue("saved.endAt", Wprr.utils.object.copyViaJson(this._endAt));
		this._externalStorage.updateValue("endAt", Wprr.utils.object.copyViaJson(this._endAt));
		
		this._externalStorage.updateValue("saved.status", Wprr.utils.object.copyViaJson(this._status));
		this._externalStorage.updateValue("status", Wprr.utils.object.copyViaJson(this._status));
		
		return this;
	}
	
	_updateExternalStorage(aName, aValue) {
		//console.log("TimelineField::_updateExternalStorage");
		
		if(this._externalStorage) {
			this._externalStorage.updateValue(aName, aValue);
		}
	}
	
	externalDataChange() {
		//console.log("TimelineField::externalDataChange");
		
		let lastValue = this._startAt;
		let startAt = this._externalStorage.getValue("startAt");
		if(startAt !== undefined) {
			this._startAt = startAt;
		}
		let endAt = this._externalStorage.getValue("endAt");
		if(endAt) {
			this._endAt = endAt;
		}
		let status = this._externalStorage.getValue("status");
		if(status) {
			this._status = status;
		}
	}
	
	setId(aId) {
		this._id = aId;
		
		return this;
	}
	
	getId() {
		return this._id;
	}
	
	endIfActive(aTimestamp) {
		console.log("endIfActive");
		
		if(this._endAt === -1 || this._endAt > aTimestamp) {
			this.setEndAt(aTimestamp);
		}
	}
	
	endNowIfActive() {
		console.log("endNowIfActive");
		
		let currentTime = moment().unix();
		this.endIfActive(currentTime);
	}
	
	setStartAt(aTimestamp) {
		this._startAt = aTimestamp;
		this._updateExternalStorage("startAt", aTimestamp);
	}
	
	setEndAt(aTimestamp) {
		this._endAt = aTimestamp;
		this._updateExternalStorage("endAt", aTimestamp);
	}
	
	setStatus(aStatus) {
		this._status = aStatus;
		this._updateExternalStorage("status", aStatus);
	}
	
	isActiveAt(aTimestamp) {
		//console.log("isActiveAt");
		
		//console.log(aTimestamp, this._startAt, this._endAt);
		if((this._endAt === -1 || this._endAt > aTimestamp) && (this._startAt === -1 || this._startAt <= aTimestamp)) {
			return true;
		}
		
		return false;
	}
	
	hasUnsavedChanges() {
		
		if(this._externalStorage.getValue("startAt") !== this._externalStorage.getValue("saved.startAt")) {
			return true;
		}
		if(this._externalStorage.getValue("endAt") !== this._externalStorage.getValue("saved.endAt")) {
			return true;
		}
		if(this._externalStorage.getValue("status") !== this._externalStorage.getValue("saved.status")) {
			return true;
		}
		
		return false;
	}
	
	_addFieldChange(aFieldName, aValue, aSaveData) {
		
		if(aFieldName === "status") {
			aSaveData.changes.setField(aFieldName, aValue);
		}
		else {
			aSaveData.changes.setDataField(aFieldName, aValue);
		}
		
		aSaveData.addUpdateSavedFieldCommand(aFieldName, this._externalStorage);
	}
	
	_getSaveDataForField(aFieldName, aSaveData) {
		let editStorage = this._externalStorage;
		
		let newValue = editStorage.getValue(aFieldName);
		let oldValue = editStorage.getValue("saved." + aFieldName);
		if(newValue !== oldValue) {
			this._addFieldChange(aFieldName, newValue, aSaveData);
		}
		
		return null;
	}
	
	getSaveData() {
		
		let saveData = Wprr.wp.admin.SaveData.create(this.item.id);
		
		this._getSaveDataForField("startAt", saveData);
		this._getSaveDataForField("endAt", saveData);
		this._getSaveDataForField("status", saveData);
		
		return saveData;
	}
	
	toJSON() {
		return "[Relation id=" + this._id + "]";
	}
}
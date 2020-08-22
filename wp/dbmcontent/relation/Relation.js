import Wprr from "wprr/Wprr";
import React from "react";

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
	
	toJSON() {
		return "[Relation id=" + this._id + "]";
	}
}
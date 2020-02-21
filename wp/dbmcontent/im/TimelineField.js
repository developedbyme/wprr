import Wprr from "wprr/Wprr";
import React from "react";

export default class TimelineField {
	
	constructor() {
		
		this._messageGroup = null;
		
		this.key = null;
		this.value = null;
		this.changes = [];
		
		this.type = null;
		this.status = null;
		
		this.settings = new Object();
	}
	
	setMessageGroup(aMessageGroup) {
		this._messageGroup = aMessageGroup;
		
		return this;
	}
	
	setValue(aValue) {
		this.value = aValue;
		
		return this;
	}
	
	setupChanges(aPastChanges, aFutureChanges) {
		let changes = new Array();
		if(aPastChanges) {
			changes = changes.concat(aPastChanges);
		}
		
		if(aFutureChanges) {
			changes = changes.concat(aFutureChanges);
		}
		
		this.changes = changes;
		
		return this;
	}
	
	setupField(aKey, aType, aStatus, aSettings) {
		this.key = aKey;
		this.type = aType;
		this.status = aStatus;
		
		this.settings = aSettings; //METODO: copy object
		
		return this;
	}
	
	setValueAt(aValue, aTime) {
		//METODO
		
		return this;
	}
	
}
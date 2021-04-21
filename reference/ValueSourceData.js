"use strict";
import Wprr from "wprr/Wprr";

import SourceData from "wprr/reference/SourceData";

import TWEEN from "@tweenjs/tween.js";

// import ValueSourceData from "wprr/reference/ValueSourceData";
export default class ValueSourceData extends SourceData {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/ValueSourceData::constructor");
		
		super();
		
		this._value = null;
		this._tween = null;
		
		this._sourceFunction = this.getValue;
		
		this._callback_onCompleteBound = this._callback_onComplete.bind();
		this._changeCommands = null;
	}
	
	get value() {
		return this._value;
	}
	
	set value(aValue) {
		
		this.setValue(aValue);
		
		return this._value;
	}
	
	addChangeCommand(aCommand) {
		if(!this._changeCommands) {
			this._changeCommands = new Array();
		}
		this._changeCommands.push(aCommand);
		
		return this;
	}
	
	_shouldUpdateOwner(aName, aOwner) {
		return true;
	}
	
	reSource() {
		return Wprr.source("source", this);
	}
	
	getValue() {
		return this._value;
	}
	
	updateValue(aValue) {
		this.setValue(aValue);
		
		return this;
	}
	
	updateValueFromObject(aValue, aFromObject) {
		this.updateValue(aValue);
		
		return this;
	}
	
	setValue(aValue) {
		//console.log("setValue");
		
		if(!Wprr.utils.object.isEqual(this._value, aValue)) {
			this._value = aValue;
			this.externalDataChange();
		
			if(this._changeCommands) {
				Wprr.utils.CommandPerformer.perform(this._changeCommands, aValue, null);
			}
		}
		
		return this;
	}
	
	makeStorable() {
		//console.log("makeStorable");
		if(!this.sources.storedValue) {
			this.createSource("storedValue", Wprr.utils.object.tryCopyViaJson(this.value));
			this.createSource("changed", false);
			
			let changeCommand = Wprr.commands.callFunction(this.reSource(), this._checkForStoreChange);
			this.addChangeCommand(changeCommand);
			this.sources.storedValue.addChangeCommand(changeCommand);
		}
	}
	
	store() {
		//console.log("store");
		//console.log(this);
		
		if(this.sources.storedValue) {
			this.storedValue = Wprr.utils.object.tryCopyViaJson(this.value);
		}
		
		return this;
	}
	
	resetToStoredValue() {
		if(this.sources.storedValue) {
			this.value = Wprr.utils.object.tryCopyViaJson(this.storedValue);
		}
		
		return this;
	}
	
	_checkForStoreChange() {
		//console.log("_checkForStoreChange");
		//console.log(this);
		
		let value = this.value;
		let storedValue = this.storedValue;
		let previousChanged = this.changed;
		
		let isChanged;
		
		if(value !== null && typeof(value) === "object") {
			try {
				isChanged = (JSON.stringify(value) !== JSON.stringify(storedValue));
			}
			catch(theError) {
				isChanged = (value !== storedValue);
			}
		}
		else {
			isChanged = (value !== storedValue);
		}
		
		if(isChanged !== previousChanged) {
			this.changed = isChanged;
		}
	}
	
	connectSource(aSource) {
		console.log("connectSource");
		console.log(aSource);
		
		let connection = new Wprr.utils.SourceConnection();
		connection.addValueSource(this);
		connection.addValueSource(aSource);
		
		aSource.value = this.value;
		
		return connection;
	}
	
	connectExternalStorage(aExternalStorage, aPath) {
		let connection = new Wprr.utils.SourceConnection();
		connection.addValueSource(this);
		
		connection.addExternalStrorageVariable(aExternalStorage, aPath);
		
		return connection;
	}
	
	_callback_onUpdate() {
		
	}
	
	_callback_onComplete() {
		this._tween = null;
	}
	
	stopAnimations() {
		if(this._tween) {
			this._tween.stop();
			this._tween = null;
		}
	}
	
	animateValue(aNewValue, aTime = 0.4, aEasing = null, aDelay = 0) {
		//console.log("animateValue");
		this.stopAnimations();
		
		if(!aEasing) {
			aEasing = TWEEN.Easing.Quadratic.Out;
		}
		
		this._tween = new TWEEN.Tween(this).to({"value": aNewValue}, 1000*aTime).easing(aEasing);
		if(aDelay) {
			this._tween.delay(1000*aDelay);
		}
		this._tween.onComplete(this._callback_onCompleteBound).start();
	}
	
	static create(aValue) {
		let newValueSourceData = new ValueSourceData();
		
		newValueSourceData.setValue(aValue);
		
		return newValueSourceData;
	}
}
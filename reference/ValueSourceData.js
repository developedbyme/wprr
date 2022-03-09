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
		
		this._callback_onCompleteBound = this._callback_onComplete.bind(this);
		this._changeCommands = null;
		
		this._connections = [];
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
	
	_addSubscriptionsForOwner(aOwner) {
		//MENOTE: do nothing
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
			this.updateForValueChange();
		}
		
		return this;
	}
	
	input(aValue) {
		if(aValue instanceof ValueSourceData) {
			aValue.connectSource(this);
		}
		else {
			let MultiTypeItemLinks = Wprr.objectPath(Wprr, "utils.data.MultiTypeItemLinks");
			let SingleLink = Wprr.objectPath(Wprr, "utils.data.SingleLink");
			
			if(MultiTypeItemLinks && aValue instanceof MultiTypeItemLinks) {
				aValue.idsSource.connectSource(this);
			}
			else if(SingleLink && aValue instanceof SingleLink) {
				aValue.idSource.connectSource(this);
			}
			else {
				this.setValue(aValue);
			}
			
		}
		
		return this;
	}
	
	updateForValueChange() {
		this.externalDataChange();
	
		if(this._changeCommands) {
			Wprr.utils.CommandPerformer.perform(this._changeCommands, this._value, null);
		}
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
	
	_linkRegistration_addConnection(aConnection) {
		
		this._connections.push(aConnection);
		
		return this;
	}
	
	getConnectionIfExistsTo(aSource) {
		let currentArray = this._connections;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentConnection = currentArray[i];
			if(currentConnection.hasSource(aSource)) {
				return currentConnection;
			}
		}
		
		return null;
	}
	
	connectSource(aSource) {
		//console.log("connectSource");
		//console.log(aSource);
		
		let existingConnection = this.getConnectionIfExistsTo(aSource);
		if(existingConnection) {
			return existingConnection;
		}
		
		let connection = new Wprr.utils.SourceConnection();
		connection.addValueSource(this);
		connection.addValueSource(aSource);
		
		aSource.value = this.value;
		
		return connection;
	}
	
	connectExternalStorage(aExternalStorage, aPath) {
		let connection = new Wprr.utils.SourceConnection();
		connection.addValueSource(this);
		
		if(this.value) {
			aExternalStorage.updateValue(aPath, this.value);
		}
		else if(aExternalStorage.getValue(aPath)) {
			this.value = aExternalStorage.getValue(aPath);
		}
		
		connection.addExternalStorageVariable(aExternalStorage, aPath);
		
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
		
		return this;
	}
	
	animateValue(aNewValue, aTime = 0.4, aEasing = null, aDelay = 0) {
		//console.log("animateValue");
		this.stopAnimations();
		
		return this.addAnimation(aNewValue, aTime, aEasing, aDelay);
	}
	
	addAnimation(aNewValue, aTime = 0.4, aEasing = null, aDelay = 0) {
		if(!aEasing) {
			aEasing = TWEEN.Easing.Quadratic.Out;
		}
		else if(typeof(aEasing) === 'string') {
			aEasing = Wprr.objectPath(TWEEN.Easing, aEasing);
		}
		
		this._tween = new TWEEN.Tween(this).to({"value": aNewValue}, 1000*aTime).easing(aEasing);
		if(aDelay) {
			this._tween.delay(1000*aDelay);
			
			this._tween.onStart(ValueSourceData.updateStartAnimationValue);
		}
		this._tween.onComplete(this._callback_onCompleteBound).start();
		
		return this;
	}
	
	setWithDelay(aValue, aDelay) {
		setTimeout((function() {this.setValue(aValue);}).bind(this), Math.round(1000*aDelay));
		
		return this;
	}
	
	toggleValue(aSteps = [true, false]) {
		let currentValue = this.value;
		let index = aSteps.indexOf(currentValue);
		if(index === -1) {
			console.warn(currentValue + " is not present in steps " + aSteps + ". Restarting");
		}
		let nextPosition = (index+1)%aSteps.length;
		this.value = aSteps[nextPosition];
		
		return this;
	}
	
	static create(aValue) {
		let newValueSourceData = new ValueSourceData();
		
		newValueSourceData.setValue(aValue);
		
		return newValueSourceData;
	}
	
	static updateStartAnimationValue(aTweenParameters) {
		this._valuesStart["value"] = aTweenParameters["value"];
	}
}
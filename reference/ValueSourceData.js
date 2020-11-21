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
	}
	
	get value() {
		return this._value;
	}
	
	set value(aValue) {
		
		this.setValue(aValue);
		
		return this._value;
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
		
		//METODO: check if value has changed
		
		this._value = aValue;
		this.externalDataChange();
		
		return this;
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
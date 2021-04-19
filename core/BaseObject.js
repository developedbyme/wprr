"use strict";
import Wprr from "wprr/Wprr";

// import BaseObject from "wprr/core/BaseObject";
export default class BaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/core/BaseObject::constructor");
		
		this._sources = null;
	}
	
	_init() {
		//MENOTE: should be overridden
	}
	
	init() {
		this._init();
	}
	
	get sources() {
		
		if(!this._sources) {
			this._sources = new Wprr.core.Sources();
			this._sources.setOwner(this);
		}
		
		return this._sources;
	}
	
	createSource(aName, aInitialValue) {
		this.sources.create(aName);
		this[aName] = aInitialValue;
	}
}
"use strict";
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Sources from "wprr/core/Sources";
export default class Sources extends BaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/core/Sources::constructor");
		
		super();
		
		this._owner = null;
		this._sources = new Object();
	}
	
	_init() {
		super._init();
	}
	
	setOwner(aOwner) {
		this._owner = aOwner;
		
		return this;
	}
	
	_getIfExist(aName) {
		return this._sources[aName];
	}
	
	create(aName) {
		let source = this._getIfExist(aName);
		
		if(!source) {
			source = Wprr.sourceValue(null);
			
			Object.defineProperty(this, aName, {
				get() {
					return this.get(aName);
				}
			});
			
			Object.defineProperty(this._owner, aName, {
				get() {
					return this.sources.get(aName).value;
				},
				set(aValue) {
					this.sources.get(aName).value = aValue;
				}
			});
			
			this._sources[aName] = source;
		}
		
		return source;
	}
	
	get(aName) {
		let source = this._getIfExist(aName);
		
		return source;
	}
}
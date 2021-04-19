"use strict";

import Wprr from "wprr/Wprr";

//import ReferenceHolder from "wprr/reference/ReferenceHolder";
export default class ReferenceHolder {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/ReferenceHolder::constructor");
		
		this._objects = new Object();
		this._cache = new Object();
		this._parentReferenceHolder = null;
		
		this._debug_id = Math.random();
	}
	
	setParent(aParent) {
		this._parentReferenceHolder = aParent;
		
		return this;
	}
	
	addObject(aName, aObject) {
		this._objects[aName] = aObject;
		
		return this;
	}
	
	
	getObject(aName) {
		//console.log("wprr/reference/ReferenceHolder::getObject");
		
		if(this._objects[aName] === undefined) {
			
			if(!Wprr.development_updateFullTreeOnInjection && this._cache[aName] !== undefined) {
				return this._cache[aName];
			}
			
			let returnValue = null;
			if(this._parentReferenceHolder) {
				let returnValue = this._parentReferenceHolder.getObjectIfExists(aName);
				this._cache[aName] = returnValue;
				return returnValue;
			}
			console.warn("Reference " + aName + " doesn't exist.", this);
			return returnValue;
		}
		
		return this._objects[aName];
	}
	
	getObjectIfExists(aName) {
		//console.log("wprr/reference/ReferenceHolder::getObjectIfExists");
		
		if(!Wprr.development_updateFullTreeOnInjection && this._cache[aName] !== undefined) {
			return this._cache[aName];
		}
		
		if(this._objects[aName] === undefined) {
			if(this._parentReferenceHolder) {
				let returnValue = this._parentReferenceHolder.getObjectIfExists(aName);
				this._cache[aName] = returnValue;
				return returnValue;
			}
			return null;
		}
		
		return this._objects[aName];
	}
}
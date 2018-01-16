"use strict";

//import ReferenceHolder from "wprr/reference/ReferenceHolder";
export default class ReferenceHolder {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/ReferenceHolder::constructor");
		
		this._objects = new Object();
		this._parentReferenceHolder = null;
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
			if(this._parentReferenceHolder) {
				return this._parentReferenceHolder.getObject(aName);
			}
			console.warn("Reference " + aName + " doesn't exist.", this);
			return null;
		}
		
		return this._objects[aName];
	}
}
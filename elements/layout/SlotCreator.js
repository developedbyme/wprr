import React from "react";
import Wprr from "wprr/Wprr";

import objectPath from "object-path";

//import SlotCreator from "wprr/elements/layout/SlotCreator";
export default class SlotCreator {

	constructor() {
		
		this.owner = null;
		this._defaults = new Object();
	}
	
	setOwner(aOwner) {
		this.owner = aOwner;
		
		return this;
	}
	
	setDefaults(aObject) {
		this._defaults = aObject;
		
		return this;
	}
	
	getDefaults() {
		return this._defaults;
	}
	
	source(aName, aDefaultValue) {
		
		this._defaults[aName] = aDefaultValue;
		
		return this.useProp(aName);
	}
	
	prop(aName, aDefaultValue) {
		
		this._defaults[aName] = aDefaultValue;
		this.owner.addExposedProps(aName);
		
		return this.useProp(aName);
	}
	
	useSource(aName) {
		return this.owner.getSourceChain(aName);
	}
	
	useProp(aName) {
		return this.useSource(aName);
	}
	
	slot(aName, aDefaultElement) {
		
		this._defaults[aName] = aDefaultElement;
		
		return this.useSlot(aName);
	}
	
	useSlot(aName) {
		return this.owner.getSlot(aName);
	}
	
	default(aDefaultElement) {
		return this.slot("defaultSlot", aDefaultElement);
	}
}
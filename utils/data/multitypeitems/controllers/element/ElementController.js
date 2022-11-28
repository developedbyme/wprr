import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class ElementController extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
		this._updateElementCommand = Wprr.commands.callFunction(this, this._updateElement);
	}
	
	setup() {
		
		this.item.setValue("propNames", []);
		this.item.setValue("element", null);
		this.item.setValue("insertElement", null);
		
		this.item.getType("propNames").addChangeCommand(this._updateElementCommand);
		this.item.getType("element").addChangeCommand(this._updateElementCommand);
		//METODO: add props map
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("elementController", this);
		this.setup();
		
		return this;
	}
	
	setElement(aElement) {
		this.item.setValue("element", aElement);
		
		return this;
	}
	
	addProp(aName, aValue = null) {
		if(!this.item.hasType(aName)) {
			this.item.setValue(aName, null);
		}
		
		return this;
	}
	
	_updateElement() {
		//console.log("_updateElement");
		//console.log(this);
		
		let props = new Object();
		let currentArray = this.item.getValue("propNames");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			props[currentName] = this.item.getValue(currentName);
		}
		
		props["element"] = this.item.getValue("element");
		
		let element = React.createElement(Wprr.InsertElement, props);
		
		this.item.setValue("insertElement", element);
	}
	
	toJSON() {
		return "[ElementController id=" + this._id + "]";
	}
	
	static create(aItem, aElement = null) {
		let newElementController = new ElementController();
		newElementController.setupForItem(aItem);
		newElementController.setElement(aElement);
		
		return newElementController;
	}
}
import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";
import ReactChildFunctions from "wprr/utils/ReactChildFunctions";

import objectPath from "object-path";

import SlotCreator from "wprr/elements/layout/SlotCreator";

//import Layout from "wprr/elements/layout/Layout";
export default class Layout extends WprrBaseObject {

	constructor() {
		
		super();
		
		this._layoutName = "layout";
		this._element = null;
		
		this._externalStorage = new Wprr.utils.DataStorage();
		this._exposedProps = new Array();
		
		this._sources = new Object();
	}
	
	_removeUsedProps(aReturnObject) {
		super._removeUsedProps(aReturnObject);
		
		let currentArray = this._exposedProps;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			delete aReturnObject[currentArray[i]];
		}
		
		return aReturnObject;
	}
	
	addExposedProps(...aNames) {
		let currentArray = aNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			this._exposedProps.push(currentName);
			this.getSource(currentName);
		}
		
		return this;
	}
	
	getExternalStorageName() {
		return this._layoutName + "/externalStorage";
	}
	
	getSource(aName) {
		if(!this._sources[aName]) {
			this._sources[aName] = new Wprr.sourceValue(null);
		}
		
		return this._sources[aName];
	}
	
	getSourceChain(aType) {
		
		return this.getSource(aType);
		
		/*
		let returnSource = Wprr.sourceFirst(
			Wprr.sourceReferenceIfExists(this.getExternalStorageName(), "slots." + aType),
			Wprr.sourceReferenceIfExists(this._layoutName + "/slots/" + aType),
			Wprr.sourceReferenceIfExists(this.getExternalStorageName(), "defaults." + aType)
		)
		
		return returnSource;
		*/
	}
	
	getSlot(aType) {
		return React.createElement(Wprr.InsertElement, {"element": this.getSourceChain(aType)})
	}
	
	_getLayout(aSlotCreator) {
		
		aSlotCreator.slot("defaultSlot", React.createElement("div", {}));
		
		return React.createElement("div", {}, "No main element set for layout");
	}
	
	_getDefaults() {
		let returnObject = new Object();
		
		let slotCreator = new SlotCreator();
		slotCreator.setOwner(this);
		slotCreator.setDefaults(returnObject);
		
		returnObject["main"] = this._getLayout(slotCreator);
		
		return returnObject;
	}
	
	_getElement() {
		let injectData = {};
		injectData[this._layoutName] = this;
		injectData[this._layoutName + "/externalStorage"] = this._externalStorage;
		
		for(let objectName in this._sources) {
			injectData[this._layoutName + "/slots/" + objectName] = this._sources[objectName];
		}
		
		return React.createElement(Wprr.ReferenceInjection, {"injectData": injectData}, 
			this.getSlot("main")
		);
	}
	
	_getCachedElement() {
		if(!this._element) {
			this._element = this._getElement();
		}
		
		return this._element;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let defaults = this._getDefaults();
		this._externalStorage.updateValue("defaults", defaults);
	}
	
	_getAdditionalSourcesToRegister() {
		let returnObject = super._getAdditionalSourcesToRegister();
		
		let defaults = this._externalStorage.getValue("defaults");
		for(let objectName in defaults) {
			
			returnObject["defaults_" + objectName] = defaults[objectName];
		}
		
		return returnObject;
	}
	
	_prepareRender() {
		
		let slots = new Object();
		
		{
			let defaults = this._externalStorage.getValue("defaults");
			for(let objectName in defaults) {
				let defaultValue = this.resolveSourcedData(defaults[objectName]);
				objectPath.set(slots, objectName, this.getFirstInputWithDefault("slot_" + objectName, Wprr.sourceProp("slots", objectName), defaultValue));
			}
		}
		
		{
			let children = ReactChildFunctions.getChildrenForComponent(this);
			let groupedChildren = Wprr.utils.array.groupArray(children, "props.data-slot");
			
			let defaultSlotChildren = new Array();
			
			let currentArray = groupedChildren;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentGroup = currentArray[i];
				if(currentGroup["key"] === "undefined" || currentGroup["key"] === "defaultSlot") {
					defaultSlotChildren = defaultSlotChildren.concat(currentGroup["value"]);
				}
				else {
					if(currentGroup["value"].length === 1 && false) {
						objectPath.set(slots, currentGroup["key"], currentGroup["value"][0]);
					}
					else {
						objectPath.set(slots, currentGroup["key"], currentGroup["value"]);
					}
				}
			}
			
			if(defaultSlotChildren.length > 0) {
				objectPath.set(slots, "defaultSlot", defaultSlotChildren);
			}
		}
		
		{
			let currentArray = this._exposedProps;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				
				let currentValue = this.getFirstInput(Wprr.sourcePropWithDots(currentName));
				if(currentValue !== null || objectPath.get(slots, currentName) === undefined) {
					objectPath.set(slots, currentName, currentValue);
				}
			}
		}
		
		this._externalStorage.updateValue("slots", slots);
		
		console.log(slots);
		for(let objectName in slots) {
			let currrentSource = this.getSource(objectName);
			currrentSource.value = slots[objectName];
			console.log(objectName, currrentSource);
		}
		
		super._prepareRender();
	}
	
	_renderMainElement() {
		//console.log("Layout::_renderMainElement", this);
		return this._getCachedElement();
	}
}
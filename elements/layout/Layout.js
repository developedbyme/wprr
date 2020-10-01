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
			this._exposedProps.push(currentArray[i]);
		}
		
		return this;
	}
	
	getExternalStorageName() {
		return this._layoutName + "/externalStorage";
	}
	
	getSourceChain(aType) {
		let returnSource = Wprr.sourceFirst(
			Wprr.sourceReferenceIfExists(this.getExternalStorageName(), "slots." + aType),
			Wprr.sourceReferenceIfExists(this._layoutName + "/slots/" + aType),
			Wprr.sourceReferenceIfExists(this.getExternalStorageName(), "defaults." + aType)
		)
		
		return returnSource;
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
		let defaults = this._getDefaults();
		this._externalStorage.updateValue("defaults", defaults);
		
		super._prepareInitialRender();
	}
	
	_prepareRender() {
		
		let slots = new Object();
		
		{
			let defaults = this._externalStorage.getValue("defaults");
			for(let objectName in defaults) {
				objectPath.set(slots, objectName, this.getFirstInput("slot_" + objectName, Wprr.sourceProp("slots", objectName)));
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
				objectPath.set(slots, currentName, currentValue);
			}
		}
		
		this._externalStorage.updateValue("slots", slots);
		
		super._prepareRender();
	}
	
	_renderMainElement() {
		return this._getCachedElement();
	}
}
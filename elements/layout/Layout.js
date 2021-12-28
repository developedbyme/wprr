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
		
		this._elementTreeItem.requireValue("slotNames", []);
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
		
		let valueName = "slot/" + aName;
		
		let slotNames = this._elementTreeItem.getValue("slotNames");
		if(slotNames.indexOf(aName) === -1) {
			slotNames = [].concat(slotNames);
			slotNames.push(aName);
			this._elementTreeItem.requireValue(valueName, null);
			this._elementTreeItem.setValue("slotNames", slotNames);
			
			let source = this._elementTreeItem.getType(valueName);
			source.addChangeCommand(Wprr.commands.callFunction(this, this._sourceChanged, [aName]));
		}
		
		
		return this._elementTreeItem.getType(valueName);
	}
	
	_sourceChanged(aName) {
		//console.log("_sourceChanged");
		//console.log(aName);
		
		let valueName = "slot/" + aName;
		this.updateProp(aName, this._elementTreeItem.getValue(valueName));
	}
	
	getSourceChain(aType) {
		console.warn("Use getSource instead of getSourceChain", this);
		return this.getSource(aType);
	}
	
	getSlot(aType) {
		return React.createElement(Wprr.InsertElement, {"element": this.getSource(aType)})
	}
	
	getGroupSlot(aPath) {
		
		let sources = new Array();
		
		let currentArray = aPath.split("/");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentPath = currentArray.join("/");
			
			sources.push(this.getSource(currentPath));
			currentArray.shift();
		}
		
		return React.createElement(Wprr.InsertElement, {"element": Wprr.sourceFirst(...sources), "sourceUpdates": sources});
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
		injectData[this._layoutName + "/elementTreeItem"] = this._elementTreeItem;
		
		
		let slotNames = this._elementTreeItem.getValue("slotNames");
		let currentArray = slotNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let slotName = currentArray[i];
			injectData[this._layoutName + "/internalSlots/" + slotName] = this.getSource(slotName);
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
		
		this._updateSlots();
	}
	
	_getAdditionalSourcesToRegister() {
		let returnObject = super._getAdditionalSourcesToRegister();
		
		let defaults = this._externalStorage.getValue("defaults");
		for(let objectName in defaults) {
			
			returnObject["defaults_" + objectName] = defaults[objectName];
		}
		
		return returnObject;
	}
	
	_updateSlots() {
		let slots = new Object();
		
		{
			let defaults = this._externalStorage.getValue("defaults");
			for(let objectName in defaults) {
				let defaultValue = this.resolveSourcedData(defaults[objectName]);
				
				let referenceValue = this.getFirstInput(Wprr.sourceReferenceIfExists(this._layoutName + "/slots/" + objectName));
				if(referenceValue !== null) {
					defaultValue = referenceValue;
				}
				
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
		
		for(let objectName in slots) {
			let currrentSource = this.getSource(objectName);
			currrentSource.value = slots[objectName];
		}
	}
	
	_prepareRender() {
		
		this._updateSlots();
		
		super._prepareRender();
	}
	
	_renderMainElement() {
		//console.log("Layout::_renderMainElement", this);
		return this._getCachedElement();
	}
}
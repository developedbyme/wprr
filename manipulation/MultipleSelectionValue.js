import React from 'react';
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import MultipleSelectionValue from "wprr/manipulation/MultipleSelectionValue";
export default class MultipleSelectionValue extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["selected"] = false;
		
		this._propsThatShouldNotCopy.push("fieldName");
		this._propsThatShouldNotCopy.push("externalStorage");
		this._propsThatShouldNotCopy.push("value");
		this._propsThatShouldNotCopy.push("valueName");
	}
	
	externalDataChange() {
		this._updateState();
	}
	
	_updateExternalStorage(aValue) {
		//console.log("wprr/manipulation/MultipleSelectionValue::_updateExternalStorage");
		
		let externalStorage = this.getFirstInput("externalStorage", Wprr.sourceReference("externalStorage"));
		let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
		let value = this.getSourcedProp("value");
		
		if(externalStorage) {
			
			let startValue = externalStorage.getValue(fieldName);
			let currentArray = [];
			if(Array.isArray(startValue)) {
				currentArray = [].concat(startValue);
			}
			
			if(aValue) {
				currentArray.push(value);
			}
			else {
				let index = currentArray.indexOf(value);
				if(index !== -1) {
					currentArray.splice(index, 1);
				}
			}
			
			externalStorage.updateValue(fieldName, currentArray);
		}
	}
	
	_updateState() {
		let externalStorage = this.getSourcedProp("externalStorage");
		let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
		let value = this.getSourcedProp("value");
		
		if(externalStorage) {
			let currentArray = externalStorage.getValue(fieldName);
			let newState = false;
			if(currentArray) {
				let index = currentArray.indexOf(value);
				newState = (index !== -1);
			}
			
			if(newState !== this.state["selected"]) {
				this.setState({"selected": newState});
			}
		}
	}
	
	_prepareInitialRender() {
		//console.log("wprr/manipulation/MultipleSelectionValue::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		let externalStorage = this.getSourcedProp("externalStorage");
		let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
		
		if(externalStorage) {
			externalStorage.addOwner(this);
			
			let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
			let value = this.getSourcedProp("value");
			
			let currentArray = externalStorage.getValue(fieldName);
			let newState = false;
			if(currentArray) {
				let index = currentArray.indexOf(value);
				newState = (index !== -1);
			}
			
			this.state["selected"] = newState;
		}
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		//console.log("wprr/manipulation/MultipleSelectionValue::updateValue");
		//console.log(aName, aValue, aAdditionalData);
		
		let valueName = this.getSourcedPropWithDefault("valueName", "selected");
		if(aName === valueName) {
			this.setState({"selected": aValue});
			this._updateExternalStorage(aValue);
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/MultipleSelectionValue::_manipulateProps");
		
		let valueName = this.getSourcedPropWithDefault("valueName", "selected");
		
		aReturnObject[valueName] = this.state["selected"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let injectData = {};
		
		let valueName = this.getSourcedPropWithDefault("valueName", "selected");
		
		injectData["value/" + valueName] = this;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}

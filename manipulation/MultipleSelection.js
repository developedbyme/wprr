import React from 'react';

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import MultipleSelection from "wprr/manipulation/MultipleSelection";
export default class MultipleSelection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["value"] = false;
		
		this._propsThatShouldNotCopy.push("fieldName");
		this._propsThatShouldNotCopy.push("externalStorage");
		this._propsThatShouldNotCopy.push("valueName");
	}
	
	externalDataChange() {
		this._updateState();
	}
	
	_updateExternalStorage(aValue) {
		//console.log("wprr/manipulation/MultipleSelection::_updateExternalStorage");
		
		let externalStorage = this.getSourcedProp("externalStorage");
		let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
		
		if(externalStorage) {
			externalStorage.updateValue(fieldName, aValue);
		}
	}
	
	_updateState() {
		let externalStorage = this.getSourcedProp("externalStorage");
		let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
		
		if(externalStorage) {
			let value = externalStorage.getValue(fieldName);

			this.setState({"value": value});
		}
	}
	
	_prepareInitialRender() {
		//console.log("wprr/manipulation/MultipleSelection::_prepareInitialRender");
		
		super._prepareInitialRender();
		
		let externalStorage = this.getSourcedProp("externalStorage");
		let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
		
		if(externalStorage) {
			externalStorage.addOwner(this);
			
			let fieldName = this.getSourcedPropWithDefault("fieldName", "selection");
			let value = externalStorage.getValue(fieldName);

			this.state["value"] = value;
		}
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		//console.log("wprr/manipulation/MultipleSelection::updateValue");
		//console.log(aName, aValue, aAdditionalData);
		
		let valueName = this.getSourcedPropWithDefault("valueName", "selection");
		if(aName === valueName) {
			this.setState({"value": aValue});
			this._updateExternalStorage(aValue);
		}
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/manipulation/MultipleSelection::_manipulateProps");
		
		let valueName = this.getSourcedPropWithDefault("valueName", "selection");
		
		aReturnObject[valueName] = this.state["value"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let injectData = {};
		
		let valueName = this.getSourcedPropWithDefault("valueName", "selection");
		
		injectData["value/" + valueName] = this;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}

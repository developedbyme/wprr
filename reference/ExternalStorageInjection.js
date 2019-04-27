import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DataStorage from "wprr/utils/DataStorage";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import ExternalStorageInjection from "wprr/reference/ExternalStorageInjection";
export default class ExternalStorageInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._externalStorage = new DataStorage();
		
	}
	
	getExternalStorage() {
		return this._externalStorage;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ExternalStorageInjection::_removeUsedProps");
		
		delete aReturnObject["storageName"];
		delete aReturnObject["initialValues"];
		
		return aReturnObject;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let initialValues = this.getSourcedProp("initialValues");
		if(initialValues) {
			for(let objectName in initialValues) {
				this._externalStorage.updateValue(objectName, initialValues[objectName]);
			}
		}
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let storageName = this.getSourcedPropWithDefault("storageName", "externalStorage");
		
		let injectData = new Object();
		injectData[storageName] = this._externalStorage;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
	
	static createReactElement(aStorageName, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"storageName": aStorageName}, aChildOrChildren);
	}
}

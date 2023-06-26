import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DataStorage from "wprr/utils/DataStorage";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import CommandPerformer from "wprr/commands/CommandPerformer";

//import ExternalStorageInjection from "wprr/reference/ExternalStorageInjection";
export default class ExternalStorageInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._externalStorage = new DataStorage();
		this._injectData = new Object();
		this._lastStorageName = null;
	}
	
	getExternalStorage() {
		return this._externalStorage;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ExternalStorageInjection::_removeUsedProps");
		
		delete aReturnObject["storageName"];
		delete aReturnObject["initialExternalStorage"];
		delete aReturnObject["initialValues"];
		delete aReturnObject["changeCommands"];
		
		return aReturnObject;
	}
	
	externalDataChange() {
		//console.log("ExternalStorageInjection::externalDataChange");
		
		let commands = this.getSourcedProp("changeCommands");
		if(commands) {
			CommandPerformer.perform(commands, this._externalStorage.getData(), this);
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let initialExternalStorage = this.getSourcedProp("initialExternalStorage");
		if(initialExternalStorage) {
			this._externalStorage = initialExternalStorage;
		}
		
		let initialValues = this.getSourcedProp("initialValues");
		if(initialValues) {
			for(let objectName in initialValues) {
				this._externalStorage.updateValue(objectName, this.resolveSourcedData(initialValues[objectName]));
			}
		}
		
		this._externalStorage.addOwner(this);
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		
		if(this._externalStorage) {
			this._externalStorage.removeOwner(this);
		}
	}
	
	_renderMainElement() {
		//console.log("ExternalStorageInjection::_renderMainElement");
		
		let clonedElements = super._renderMainElement();
		
		let storageName = this.getSourcedPropWithDefault("storageName", "externalStorage");
		
		if(this._lastStorageName) {
			delete this._injectData[this._lastStorageName];
		}
		this._injectData[storageName] = this._externalStorage;
		this._lastStorageName = storageName;
		
		return React.createElement(ReferenceInjection, {"injectData": this._injectData}, clonedElements);
	}
	
	static createReactElement(aStorageName, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"storageName": aStorageName}, aChildOrChildren);
	}
}

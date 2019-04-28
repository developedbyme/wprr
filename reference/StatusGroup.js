import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DataStorage from "wprr/utils/DataStorage";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import StatusGroup from "wprr/reference/StatusGroup";
export default class StatusGroup extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._externalStorage = new DataStorage();
		
	}
	
	getExternalStorage() {
		return this._externalStorage;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/StatusGroup::_removeUsedProps");
		
		delete aReturnObject["statuses"];
		delete aReturnObject["groupName"];
		delete aReturnObject["storageName"];
		delete aReturnObject["initialValues"];
		
		return aReturnObject;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let initialValues = this.getSourcedProp("initialValues");
		let statusNames = Wprr.utils.array.arrayOrSeparatedString(this.getSourcedPropWithDefault("statuses", "status"));
		
		let currentArray = statusNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			let messageName = currentName + "/message";
			let status = 0;
			let message = "";
			if(initialValues) {
				if(initialValues[currentName]) {
					status = initialValues[currentName];
				}
				if(initialValues[messageName]) {
					message = initialValues[messageName];
				}
			}
			this._externalStorage.updateValue(currentName, status);
			this._externalStorage.updateValue(messageName, message);
		}
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let statusNames = Wprr.utils.array.arrayOrSeparatedString(this.getSourcedPropWithDefault("statuses", "status"));
		
		let prefix = "status/";
		let groupName = this.getSourcedProp("groupName");
		if(groupName) {
			prefix += groupName + "/";
		}
		
		let storageName = this.getSourcedPropWithDefault("storageName", prefix + "externalStorage");
		
		let injectData = new Object();
		injectData[storageName] = this._externalStorage;
		
		/*
		let currentArray = statusNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			injectData[prefix + currentName] = this._externalStorage.getValue(currentName);
			injectData[prefix + currentName + "/message"] = this._externalStorage.getValue(currentName + "/message");
			//METODO: these will not update on change to the external storage, needs change listener
		}
		*/
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
}

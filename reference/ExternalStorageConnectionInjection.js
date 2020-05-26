import React from "react";
import Wprr from "wprr/Wprr";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import DataStorage from "wprr/utils/DataStorage";
import ReferenceInjection from "wprr/reference/ReferenceInjection";


//import ExternalStorageConnectionInjection from "wprr/reference/ExternalStorageConnectionInjection";
export default class ExternalStorageConnectionInjection extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._connection = new Wprr.utils.DataStorageConnection();
	}
	
	getExternalStorage() {
		return this._externalStorage;
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/ExternalStorageConnectionInjection::_removeUsedProps");
		
		delete aReturnObject["storageName"];
		delete aReturnObject["externalStorage"];
		delete aReturnObject["prefix"];
		delete aReturnObject["suffix"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let clonedElements = super._renderMainElement();
		
		let storageName = this.getFirstInputWithDefault("storageName", "externalStorage");
		let externalStorage = this.getFirstInput("externalStorage", Wprr.sourceReference("externalStorage"));
		let prefix = this.getFirstInput("prefix");
		let suffix = this.getFirstInput("suffix");
		
		this._connection.setDataStorage(externalStorage);
		this._connection.setup(prefix, suffix);
		
		let injectData = new Object();
		injectData[storageName] = this._connection;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, clonedElements);
	}
	
	static createReactElement(aStorageName, aChildOrChildren) {
		return React.createElement(ReferenceInjection, {"storageName": aStorageName}, aChildOrChildren);
	}
}

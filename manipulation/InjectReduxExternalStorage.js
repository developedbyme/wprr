import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import ReduxDataStorage from "wprr/utils/ReduxDataStorage";

//import InjectReduxExternalStorage from "wprr/manipulation/InjectReduxExternalStorage";
export default class InjectReduxExternalStorage extends ManipulationBaseObject {

	constructor(props) {
		super(props);
		
		this._externalStorage = new ReduxDataStorage();
	}
	
	_manipulateProps(aReturnObject) {
		//console.log("wprr/reference/InjectReduxExternalStorage::_manipulateProps");
		
		var returnObject = super._manipulateProps(aReturnObject);
		
		delete returnObject["storageName"];
		
		return returnObject;
	}
	
	_prepareInitialRender() {
		//console.log("wprr/reference/InjectReduxExternalStorage::_prepareInitialRender");
		this._externalStorage.setStoreController(this.getReference("redux/store/wprrController"));
		
		//METODO
		//let pathPrefix = 
	}
	
	_renderClonedElement() {
		
		let storageName = this.getSourcedPropWithDefault("storageName", "externalStorage/globalRedux");
		
		let injectData = new Object();
		injectData[storageName] = this._externalStorage;
		
		return React.createElement(ReferenceInjection, {"injectData": injectData}, super._renderClonedElement());
	}
}

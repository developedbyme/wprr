import objectPath from "object-path";

// import ReduxDataStorage from "wprr/utils/ReduxDataStorage";
export default class ReduxDataStorage {
	
	constructor() {
		
		this._pathPrefix = null;
		this._storeController = null;
		this._currentState = null;
		
		this._callback_reduxChangeBound = this._callback_reduxChange.bind(this);
		this._redux_unsubscribeFunction = null;
		
		this._owners = new Array();
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	addOwner(aOwner) {
		this._owners.push(aOwner);
	}
	
	removeOwner(aOwner) {
		let currentIndex = this._owners.indexOf(aOwner);
		if(currentIndex !== -1) {
			this._owners.splice(currentIndex, 1);
		}
	}
	
	setStoreController(aStoreController) {
		this._storeController = aStoreController;
		this._currentState = this._storeController.getStore().getState();
		
		this._callback_reduxChange();
		this._redux_subscribe();
	}
	
	setPathPrefix(aPathPrefix) {
		this._pathPrefix = aPathPrefix;
	}
	
	_callback_reduxChange() {
		//console.log("wprr/utils/ReduxDataStorage::_callback_reduxChange");
		
		this._currentState = this._storeController.getStore().getState();
		
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			currentOwner.externalDataChange();
		}
	}
	
	_redux_subscribe() {
		//console.log("wprr/utils/ReduxDataStorage::_redux_subscribe");
		
		this._redux_unsubscribeFunction = this._storeController.getStore().subscribe(this._callback_reduxChangeBound);
	}
	
	_redux_unsubscribe() {
		//console.log("wprr/utils/ReduxDataStorage::_redux_unsubscribe");
		
		if(this._redux_unsubscribeFunction) {
			this._redux_unsubscribeFunction();
			this._redux_unsubscribeFunction = null;
		}
	}
	
	getData() {
		return this._currentState;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/ReduxDataStorage::updateValue");
		
		let path = aName;
		if(this._pathPrefix) {
			path = this._pathPrefix + "." + path;
		}
		
		this._storeController.setGlobalVariable(path, aValue);
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/ReduxDataStorage::getValue");
		
		let path = aName;
		if(this._pathPrefix) {
			path = this._pathPrefix + "." + path;
		}
		
		return objectPath.get(this._currentState.globalVariables, path);
	}
	
	getValueForPath(aPath) {
		return this.getValue(aPath);
	}
}
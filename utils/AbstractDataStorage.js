import Wprr from "wprr/Wprr";

// import AbstractDataStorage from "wprr/utils/AbstractDataStorage";
export default class AbstractDataStorage {
	
	constructor() {
		
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	setData(aData) {
		
		return this;
	}
	
	getData() {
		return null;
	}
	
	addOwner(aOwner) {
		
		
		return this;
	}
	
	removeOwner(aOwner) {
		//console.log("wprr/utils/AbstractDataStorage::removeOwner");
		
		
		return this;
	}
	
	disableUpdates() {
		
		return this;
	}
	
	enableUpdates(aUpdateOwners = false) {
		
		return this;
	}
	
	_updateOwners() {
		return this;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/AbstractDataStorage::updateValue");
		
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/AbstractDataStorage::getValue");
		
		return null;
	}
	
	addValueToArray(aName, aValue) {
		
		return this;
	}
	
	removeValueFromArray(aName, aValue) {
		
		return this;
	}
}
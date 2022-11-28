import objectPath from "object-path";

import DataStorage from "wprr/utils/DataStorage";

// import AttributeDataStorage from "wprr/wp/blocks/AttributeDataStorage";
export default class AttributeDataStorage extends DataStorage {
	
	constructor() {
		
		super();
		
		this._pathPrefix = null;
		this._currentState = null;
		this._setAttribute = null;
		
		this._debugId = Math.random();
	}
	
	setupAttributes(aAttributes, aSetAttributeFunction) {
		this._currentState = aAttributes;
		this._setAttribute = aSetAttributeFunction;
	}
	
	setPathPrefix(aPathPrefix) {
		this._pathPrefix = aPathPrefix;
	}
	
	getData() {
		return this._currentState;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/wp/blocks/AttributeDataStorage::updateValue");
		//console.log(aName, aValue);
		
		let path = aName;
		if(this._pathPrefix) {
			path = this._pathPrefix + "." + path;
		}
		
		let currentAttributes = JSON.parse(JSON.stringify(this._currentState));
		objectPath.set(currentAttributes, path, aValue);
		//console.log(currentAttributes);
		
		this._currentState = currentAttributes;
		
		this._setAttribute(currentAttributes);
		
		this._updateOwners();
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/wp/blocks/AttributeDataStorage::getValue");
		//console.log(aName);
		
		let path = aName;
		if(this._pathPrefix) {
			path = this._pathPrefix + "." + path;
		}
		
		return objectPath.get(this._currentState, path);
	}
}
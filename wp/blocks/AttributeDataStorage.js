import objectPath from "object-path";

// import AttributeDataStorage from "wprr/wp/blocks/AttributeDataStorage";
export default class AttributeDataStorage {
	
	constructor() {
		
		this._pathPrefix = null;
		this._currentState = null;
		this._setAttribute = null;
		
		this._owners = new Array();
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
		console.log("wprr/wp/blocks/AttributeDataStorage::updateValue");
		console.log(aName, aValue);
		
		let path = aName;
		if(this._pathPrefix) {
			path = this._pathPrefix + "." + path;
		}
		
		let currentAttributes = JSON.parse(JSON.stringify(this._currentState));
		objectPath.set(currentAttributes, path, aValue);
		console.log(currentAttributes);
		
		this._currentState = currentAttributes;
		
		this._setAttribute(currentAttributes);
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/wp/blocks/AttributeDataStorage::getValue");
		
		let path = aName;
		if(this._pathPrefix) {
			path = this._pathPrefix + "." + path;
		}
		
		return objectPath.get(this._currentState, path);
	}
}
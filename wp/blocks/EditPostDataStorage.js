import objectPath from "object-path";

import DataStorage from "wprr/utils/DataStorage";

// import EditPostDataStorage from "wprr/wp/blocks/EditPostDataStorage";
export default class EditPostDataStorage extends DataStorage {
	
	constructor() {
		
		super();
		
		this._currentState = new Object();
		this._unsubscribeFunction = null;
		this._callback_dataChangedBound = this._callback_dataChanged.bind(this);
		
		this._debugId = Math.random();
	}
	
	startSubscribing() {
		if(!this._unsubscribeFunction) {
			this._unsubscribeFunction = wp.data.subscribe(this._callback_dataChangedBound);
		}
		
		return this;
	}
	
	stopSubscribing() {
		if(this._unsubscribeFunction) {
			this._unsubscribeFunction();
			this._unsubscribeFunction = null;
		}
		
		return this;
	}
	
	_callback_dataChanged() {
		//console.log("wprr/wp/blocks/EditPostDataStorage::_callback_dataChanged");
		let coreEditor = wp.data.select("core/editor");
		
		let hasChanged = false;
		for(let objectName in this._currentState) {
			let oldValueSerialized = JSON.stringify(this._currentState[objectName]);
			let newValue = coreEditor.getEditedPostAttribute(objectName);
			let newValueSerialized = JSON.stringify(newValue);
			
			if(oldValueSerialized !== newValueSerialized) {
				hasChanged = true;
				this._currentState[objectName] = newValue;
			}
		}
		
		if(hasChanged) {
			this._updateOwners();
		}
		
	}
	
	getData() {
		return this._currentState;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/wp/blocks/EditPostDataStorage::updateValue");
		//console.log(aName, aValue);
		
		let path = aName;
		
		objectPath.set(this._currentState, path, aValue);
		
		let updateObject = new Object();
		updateObject[path] = aValue;
		
		wp.data.dispatch("core/editor").editPost(updateObject);
		
		this._setAttribute(currentAttributes);
		
		this._updateOwners();
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/wp/blocks/EditPostDataStorage::getValue");
		//console.log(aName);
		
		let path = aName;
		
		let returnValue = objectPath.get(this._currentState, path);
		if(returnValue === undefined) {
			returnValue = wp.data.select("core/editor").getEditedPostAttribute(path);
			objectPath.set(this._currentState, path, returnValue);
		}
		
		return returnValue;
	}
	
	static create() {
		let newEditPostDataStorage = new EditPostDataStorage();
		
		newEditPostDataStorage.startSubscribing();
		
		return newEditPostDataStorage;
	}
}
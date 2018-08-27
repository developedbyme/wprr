import objectPath from "object-path";

// import DataStorage from "wprr/utils/DataStorage";
export default class DataStorage {
	
	constructor() {
		this.setData(new Object());
	}
	
	setData(aData) {
		this._data = aData;
	}
	
	getData() {
		return this._data;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/DataStorage::updateValue");
		objectPath.set(this._data, aName, aValue);
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/DataStorage::getValue");
		
		return objectPath.get(this._data, aName);
	}
}
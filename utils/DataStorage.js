// import DataStorage from "wprr/utils/DataStorage";
export default class DataStorage {
	
	constructor() {
		this._data = new Object;
	}
	
	updateValue(aName, aValue) {
		//console.log("wprr/utils/DataStorage::updateValue");
		this._data[aName] = aValue;
		
		return this;
	}
	
	getValue(aName) {
		//console.log("wprr/utils/DataStorage::getValue");
		
		return this._data[aName];
	}
}
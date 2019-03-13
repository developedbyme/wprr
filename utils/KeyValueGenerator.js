import objectPath from "object-path";

// import KeyValueGenerator from "wprr/utils/KeyValueGenerator";
export default class KeyValueGenerator {
	
	constructor() {
		
		this._values = new Array();
	}
	
	addKeyValue(aKey, aValue) {
		this._values.push({"key": aKey, "value": aValue});
		
		return this;
	}
	
	addKeyLabel(aKey, aLabel) {
		this._values.push({"key": aKey, "label": aLabel});
		
		return this;
	}
	
	addKeyValueLabel(aKey, aValue, aLabel) {
		this._values.push({"key": aKey, "value": aValue, "label": aLabel});
		
		return this;
	}
	
	getAsArray() {
		return this._values;
	}
	
	static create() {
		let newKeyValueGenerator = new KeyValueGenerator();
		
		return newKeyValueGenerator;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import JoinValues from "./JoinValues";
export default class JoinValues extends BaseObject {
	
	constructor() {
		super();
		
		this._joinValuesCommand = Wprr.commands.callFunction(this, this._joinValues);
		
		this.values = new Wprr.utils.KeyValueGenerator();
		this.createSource("separator", ",").addChangeCommand(this._joinValuesCommand);
		
		this.createSource("output", "");
	}
	
	addValue(aValue) {
		
		let valueName = "index" + this.values.getAsArray().length;
		
		return this.addNamedValue(valueName, aValue);
	}
	
	addNamedValue(aKey, aValue) {
		let source = this.createSource(aKey, aValue).addChangeCommand(this._joinValuesCommand);
		
		this.values.addKeyValue(aKey, source);
		this._joinValues();
		
		return this;
	}
	
	_joinValues() {
		
		let returnArray = new Array();
		
		let currentArray = this.values.getAsArray();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSoruce = currentArray[i];
			returnArray.push(currentSoruce.value.value);
		}
		
		this.output = returnArray.join(this.separator);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import First from "./First";
export default class First extends BaseObject {
	
	constructor() {
		super();
		
		this._id = 0;
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		
		this.values = new Wprr.utils.KeyValueGenerator();
		
		this.createSource("output", null);
	}
	
	_addValue(aValue) {
		this._id++;
		let valueName = "index" + this._id;
		
		let source = this.createSource(valueName, aValue).addChangeCommand(this._updateCommand);
		
		this.values.addKeyValue(valueName, source);
	}
	
	addValue(aValue) {
		
		this._addValue(aValue);
		this._update();
		
		return this;
	}
	
	addValues(...aValues) {
		let currentArray = aValues;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._addValue(currentArray[i]);
		}
		
		this._update();
		return this;
	}
	
	_update() {
		
		let returnArray = new Array();
		
		let isOk = false;
		
		let currentArray = this.values.getAsArray();
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentSoruce = currentArray[i];
			if(currentSoruce.value.value) {
				this.output = currentSoruce.value.value;
				break;
			}
		}
		
		return this;
	}
	
	static create() {
		let newFirst = new First();
		
		return newFirst;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import SingleValueInArray from "./SingleValueInArray";
export default class SingleValueInArray extends BaseObject {
	
	constructor() {
		super();
		
		this._arrayUpdatedCommand = Wprr.commands.callFunction(this, this._arrayUpdated);
		this._filteredArrayUpdatedCommand = Wprr.commands.callFunction(this, this._filteredArrayUpdated);
		this._valueChangedCommand = Wprr.commands.callFunction(this, this._valueChanged);
		
		this.createSource("array", []);
		this.createSource("filteredArray", []).addChangeCommand(this._filteredArrayUpdatedCommand);
		this.createSource("value", null).addChangeCommand(this._valueChangedCommand);
	}
	
	setArray(aArray) {
		this.sources.get("array").input(aArray);
		
		return this;
	}
	
	setFilteredArray(aArray) {
		this.sources.get("filteredArray").input(aArray);
		
		return this;
	}
	
	setValue(aValue) {
		this.sources.get("value").input(aValue);
		
		return this;
	}
	
	_filteredArrayUpdated() {
		//console.log("_filteredArrayUpdated");
		
		if(this.filteredArray.length) {
			this.value = this.filteredArray[0];
		}
		else {
			this.value = null;
		}
	}
	
	_valueChanged() {
		//console.log("_valueChanged");
		
		let oldValues = this.filteredArray;
		let newValue = this.value;
		
		let fullArray = [].concat(this.array);
		fullArray = Wprr.utils.array.removeValues(fullArray, oldValues);
		if(newValue !== null) {
			fullArray.push(newValue);
		}
		
		this.array = fullArray;
		
		if(this.filteredArray.indexOf(newValue) !== -1) {
			this.filteredArray = [newValue];
		}
	}
}
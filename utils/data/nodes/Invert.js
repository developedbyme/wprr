import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Invert from "./Invert";
export default class Invert extends BaseObject {
	
	constructor() {
		super();
		
		this._valueUpdatedCommand = Wprr.commands.callFunction(this, this._valueUpdated);
		this._invertedValueUpdatedCommand = Wprr.commands.callFunction(this, this._invertedValueUpdated);
		
		this.createSource("value", true).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("invertedValue", false).addChangeCommand(this._invertedValueUpdatedCommand);
	}
	
	_valueUpdated() {
		//console.log("_valueUpdated");
		//console.log(this);
		
		this.invertedValue = !this.value;
	}
	
	_invertedValueUpdated() {
		//console.log("_invertedValueUpdated");
		//console.log(this);
		
		this.value = !this.invertedValue;
	}
	
	static connect(aValue, aInvertedValue) {
		//console.log("Invert::connect");
		
		let newInvert = new Invert();
		
		aValue.connectSource(newInvert.sources.get("value"));
		newInvert.sources.get("invertedValue").connectSource(aInvertedValue);
		
		//console.log(newInvert);
		
		return newInvert;
	}
}
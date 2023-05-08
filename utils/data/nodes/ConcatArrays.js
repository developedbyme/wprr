import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ConcatArrays from "./ConcatArrays";
export default class ConcatArrays extends BaseObject {
	
	constructor() {
		super();
		
		this._valueUpdatedCommand = Wprr.commands.callFunction(this, this._valueUpdated);
		
		this.createSource("input1", []).addChangeCommand(this._valueUpdatedCommand);
		this.createSource("input2", []).addChangeCommand(this._valueUpdatedCommand);
		
		this.createSource("output", []);
	}
	
	_valueUpdated() {
		//console.log("_valueUpdated");
		//console.log(this);
		
		this.output = this.input1.concat(this.input2);
	}
	
	static connect(aArray1, aArray2) {
		//console.log("ConcatArrays::connect");
		
		let newConcatArrays = new ConcatArrays();
		
		newConcatArrays.sources.get("input1").input(aArray1);
		newConcatArrays.sources.get("input2").input(aArray2);
		
		//console.log(newConcatArrays);
		
		return newConcatArrays;
	}
}
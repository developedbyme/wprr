import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Compare from "./Compare";
export default class Compare extends BaseObject {
	
	constructor() {
		super();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		
		this.createSource("input1", null).addChangeCommand(this._updateCommand);
		this.createSource("input2", null).addChangeCommand(this._updateCommand);
		this.createSource("operation", "===").addChangeCommand(this._updateCommand);
		
		this.createSource("output", false);
	}
	
	_update() {
		
		this.output = Wprr.utils.filterPartFunctions._compare(this.input1, this.input2, this.operation);
		
		return this;
	}
	
	static create() {
		let newCompare = new Compare();
		
		return newCompare;
	}
}
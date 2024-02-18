import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Ratio from "./Ratio";
export default class Ratio extends BaseObject {
	
	constructor() {
		super();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		
		this.createSource("input", 0).addChangeCommand(this._updateCommand);
		this.createSource("ratio", 1).addChangeCommand(this._updateCommand);
		
		this.createSource("output", 0);
	}
	
	_update() {
		
		this.output = this.input * this.ratio;
		
		return this;
	}
	
	static create(aInput, aRatio) {
		let newRatio = new Ratio();
		newRatio.sources.get("input").input(aInput);
		newRatio.sources.get("ratio").input(aRatio);
		
		return newRatio;
	}
}
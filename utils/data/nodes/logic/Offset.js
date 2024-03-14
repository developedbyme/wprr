import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Offset from "./Offset";
export default class Offset extends BaseObject {
	
	constructor() {
		super();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		
		this.createSource("input", 0).addChangeCommand(this._updateCommand);
		this.createSource("offset", 0).addChangeCommand(this._updateCommand);
		
		this.createSource("output", 0);
	}
	
	_update() {
		
		this.output = this.input + this.offset;
		
		return this;
	}
	
	static create(aInput, aOffset) {
		let newOffset = new Offset();
		newOffset.sources.get("input").input(aInput);
		newOffset.sources.get("offset").input(aOffset);
		
		return newOffset;
	}
}
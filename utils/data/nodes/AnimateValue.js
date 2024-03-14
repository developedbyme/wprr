import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import AnimateValue from "./AnimateValue";
export default class AnimateValue extends BaseObject {
	
	constructor() {
		super();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		
		this.createSource("input", 0).addChangeCommand(this._updateCommand);
		this.createSource("time", 0.4).addChangeCommand(this._updateCommand);
		this.createSource("easingFunction", null).addChangeCommand(this._updateCommand);
		this.createSource("delay", 0).addChangeCommand(this._updateCommand);
		
		this.createSource("output", null);
	}
	
	_update() {
		this.sources.get("output").animateValue(this.input, this.time, this.easingFunction, this.delay);
		
		return this;
	}
	
	static create() {
		let newAnimateValue = new AnimateValue();
		
		return newAnimateValue;
	}
}
import Wprr from "wprr/Wprr";
import BaseObject from "wprr/core/BaseObject";

// import CreateRange from "./CreateRange";
export default class CreateRange extends BaseObject {
	
	constructor() {
		super();
		
		this._rangeChangedCommand = Wprr.commands.callFunction(this, this._rangeChanged);
		
		this.createSource("startAt", 0).addChangeCommand(this._rangeChangedCommand);
		this.createSource("endAt", 1).addChangeCommand(this._rangeChangedCommand);
		this.createSource("step", 1).addChangeCommand(this._rangeChangedCommand);
		this.createSource("includeEndValue", true).addChangeCommand(this._rangeChangedCommand);
		this.createSource("output", [0, 1]);
	}
	
	_rangeChanged() {
		//console.log("CreateRange::_rangeChanged");
		//console.log(this);
		
		this.output = Wprr.utils.array.createRange(this.startAt, this.endAt, this.step, this.includeEndValue);
		
	}
	
	toJSON() {
		return "[CreateRange id=" + this._id + "]";
	}
	
	static connect(aStartAt = null, aEndAt = null, aStep = null, aIncludeEndValue = null) {
		let newCreateRange = new CreateRange();
		
		if(aStartAt) {
			newCreateRange.sources.get("startAt").input(aStartAt);
		}
		if(aEndAt) {
			newCreateRange.sources.get("endAt").input(aEndAt);
		}
		if(aStep) {
			newCreateRange.sources.get("step").input(aStep);
		}
		if(aIncludeEndValue) {
			newCreateRange.sources.get("includeEndValue").input(aIncludeEndValue);
		}
		
		return newCreateRange;
	}
}
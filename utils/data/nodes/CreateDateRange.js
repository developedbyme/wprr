import Wprr from "wprr/Wprr";
import BaseObject from "wprr/core/BaseObject";

import moment from "moment";

// import CreateDateRange from "./CreateDateRange";
export default class CreateDateRange extends BaseObject {
	
	constructor() {
		super();
		
		this._rangeChangedCommand = Wprr.commands.callFunction(this, this._rangeChanged);
		
		let today = moment().format("Y-MM-DD");
		
		this.createSource("startDate", today).addChangeCommand(this._rangeChangedCommand);
		this.createSource("endDate", today).addChangeCommand(this._rangeChangedCommand);
		this.createSource("step", 1).addChangeCommand(this._rangeChangedCommand);
		this.createSource("format", "Y-MM-DD").addChangeCommand(this._rangeChangedCommand);
		this.createSource("output", [today]);
	}
	
	connect(aStartDate = null, aEndDate = null, aStep = null, aFormat = null) {
		if(aStartDate) {
			this.sources.get("startDate").input(aStartDate);
		}
		if(aEndDate) {
			this.sources.get("endDate").input(aEndDate);
		}
		if(aStep) {
			this.sources.get("step").input(aStep);
		}
		if(aFormat) {
			this.sources.get("format").input(aFormat);
		}
		
		return this;
	}
	
	_rangeChanged() {
		//console.log("CreateDateRange::_rangeChanged");
		//console.log(this);
		
		this.output = Wprr.utils.array.createDateRange(this.startDate, this.endDate, this.step, this.format);
		
	}
	
	toJSON() {
		return "[CreateDateRange id=" + this._id + "]";
	}
	
	static connect(aStartDate = null, aEndDate = null, aStep = null, aFormat = null) {
		let newCreateDateRange = new CreateDateRange();
		
		newCreateDateRange.connect(aStartDate, aEndDate, aStep, aFormat);
		
		return newCreateDateRange;
	}
}
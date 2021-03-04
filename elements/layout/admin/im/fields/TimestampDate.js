import Wprr from "wprr";
import React from "react";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class TimestampDate extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._dateValue = Wprr.sourceValue(null);
		this._dateValue.addChangeCommand(Wprr.commands.callFunction(this, this._updateValue, []));
	}
	
	_updateValue() {
		console.log("_updateValue");
		
		let stringValue = this._dateValue.value;
		
		
		let newValue = -1;
		if(stringValue) {
			newValue = moment(stringValue).unix();
		}
		
		this.updateProp("value", newValue);
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
		if(externalStorage) {
			externalStorage.updateValue("value", newValue);
		}
	}
	
	_prepareRender() {
		super._prepareRender();
		
		let value = 1*this.getFirstInput("value", Wprr.sourceReference("field/externalStorage", "value"));
		
		let newValue = null;
		if(value >= 0) {
			let currentMoment = moment(1000*value);
		
			newValue = currentMoment.format("Y-MM-DD");
		}
		
		if(newValue !== this._dateValue.value) {
			this._dateValue.value = newValue;
		}
	}
	
	_renderMainElement() {
		return React.createElement(Wprr.layout.form.DateSelection, {"value": this._dateValue, className: "standard-field standard-field-padding full-width"});
	}
}
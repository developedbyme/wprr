import React from "react";
import Wprr from "wprr";

import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

//import DateAndTimeSelection from "./DateAndTimeSelection";
export default class DateAndTimeSelection extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("date-and-time-selection");
		
		let monthDate = moment().date(1).format("YYYY-MM-DD");
		
		this._month = Wprr.sourceValue(monthDate);
		this._date = Wprr.sourceValue(null);
		this._time = Wprr.sourceValue("00:00:00");
		
		let dateUdpatedCommand = Wprr.commands.callFunction(this, this._dateUpdated, []);
		this._date.addChangeCommand(dateUdpatedCommand);
		this._time.addChangeCommand(dateUdpatedCommand);
	}
	
	getValue() {
		let value = this.getFirstInput("value");
		let inputType = this.getFirstInput("inputType");
		
		if(inputType === "php" || inputType === "unix") {
			value = 1000*value;
		}
		
		return value;
	}
	
	getValueAsDate() {
		let value = this.getValue();
		
		//console.log(">>>>>>>>>>>>>>>>>>", value);
		
		if(typeof(value) === "number" && value > 0) {
			return moment(value);
		}
		if(typeof(value) === "string") {
			let date = moment(value, 'YYYY-MM-DDTHH:mm:ss', true);
			if(!date.isValid()) {
				date = moment(value, 'YYYY-MM-DDTHH:mm', true);
			}
		
			if(date.isValid()) {
				return date;
			}
		}
		
		return null;
	}
	
	_dateUpdated() {
		//console.log("DateAndTimeSelection::_dateUpdated");
		
		let fullDateString = this._date.value + "T" + this._time.value;
		//console.log(fullDateString);
		
		let date = moment(fullDateString, 'YYYY-MM-DDTHH:mm:ss', true);
		if(date.isValid()) {
			
			let valueToSave = date.format("YYYY-MM-DDTHH:mm:ss");
			let inputType = this.getFirstInput("inputType");
			if(inputType === "php" || inputType === "unix") {
				valueToSave = date.unix();
			}
			
			let value = this.getFirstInput("value");
			if(valueToSave !== value) {
				this.updateProp("value", valueToSave);
			}
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let date = this.getValueAsDate();
		
		if(date) {
			this._month.value = date.clone().date(1).format("YYYY-MM-DD");
		}
	}
	
	_prepareRender() {
		super._prepareRender();
		
		let date = this.getValueAsDate();
		
		if(date) {
			this._date.value = date.format("Y-MM-DD");
			this._time.value = date.format("HH:mm:ss");
		}
	}
	
	_stepMonth(aStep) {
		let month = moment(this._month.value).date(1).add(aStep, "month");
		this._month.value = month.format("YYYY-MM-DD");
	}
	
	_renderMainElement() {
		//console.log("DateAndTimeSelection::_renderMainElement");
		
		let postData = this.getReference("wprr/postData");
		let language = postData ? postData.getDataValue("language") : "en";
		
		let buttonClasses = this.getFirstInputWithDefault("cursor-pointer");
		//date-selection-button date-selection-button-padding
		
		return React.createElement("div", null,
			Wprr.DropdownSelection.createSelfContained(
				React.createElement("div", {className: buttonClasses},
					React.createElement(Wprr.HasData, {check: Wprr.sourceFunction(this, this.getValueAsDate), sourceUpdates: [this._time, this._date]},
						React.createElement(Wprr.FlexRow, {className: "justify-between micro-item-spacing date-selection-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize"},
							React.createElement("div", {className: "date-selection-number"},
								React.createElement(Wprr.DateDisplay, {date: this._time, format: "HH:mm:ss", "inputType": "time"}),
								" ",
								React.createElement(Wprr.DateDisplay, {date: this._date, format: "D"})
							),
							React.createElement("div", null,
								React.createElement("div", {className: "date-selection-month"},
									React.createElement(Wprr.DateDisplay, {date: this._date, format: "MMMM, Y", locale: language})
								),
								React.createElement("div", {className: "date-selection-weekday"},
									React.createElement(Wprr.DateDisplay, {date: this._date, format: "dddd", locale: language})
								)
							)
						)
					),
					React.createElement(Wprr.HasData, {check: Wprr.sourceFunction(this, this.getValueAsDate), checkType: "invert/default", sourceUpdates: [this._time, this._date]},
						React.createElement("div", {className: "date-selection-month"},
							Wprr.idText("Select date", "selectDate")
						)
					)
				),
				React.createElement("div", {className: "date-selection-overlay date-selection-overlay-padding"},
					React.createElement(Wprr.FlexRow, {className: "justify-between"},
						React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this._stepMonth, [-1])},
							React.createElement("div", {className: "cursor-pointer"}, "<")
						),
						React.createElement(Wprr.DateDisplay, {date: this._month, format: "MMMM, Y", locale: language}),
						React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this._stepMonth, [1])},
							React.createElement("div", {className: "cursor-pointer"}, ">")
						)
					),
					React.createElement("div", {className: "spacing small"}),
					React.createElement(Wprr.Calendar, {month: this._month, value: this._date}),
					React.createElement("div", {className: "spacing small"}),
					React.createElement(Wprr.FormField, {"value": this._time, "className": "standard-field standard-field-padding full-width text-align-center"})
				),
				{"className": "custom-dropdown"}
			)
		);
	}
	
	static stepMonth(aValue, aStep, aCommand) {
		let month = moment(aValue).date(1).add(aStep, "month");
		return month;
	}
}

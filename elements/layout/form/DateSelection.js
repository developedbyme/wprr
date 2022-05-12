import React from "react";
import Wprr from "wprr";

import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

//import DateSelection from "./DateSelection";
export default class DateSelection extends WprrBaseObject {

	_construct() {
		super._construct();
		
		this._addMainElementClassName("date-selection");
		
		this._calendarNavigationExternalStorage = new Wprr.utils.DataStorage();
		
		let monthDate = moment().format("YYYY-MM-DD");
		this._calendarNavigationExternalStorage.updateValue("month", monthDate);
		
		this._value = Wprr.sourceValue(null);
		this._value.addChangeCommand(Wprr.commands.callFunction(this, this._valueChanged, []));
		
		this._open = Wprr.sourceValue(false);
	}
	
	_valueChanged() {
		console.log("_valueChanged");
		
		let value = this._value.value;
		
		this.updateProp("value", value);
		
		let valueName = this.getFirstInput("valueName");
		if(valueName) {
			let updater = this.getFirstInput(Wprr.sourceReference("value/" + valueName));
			if(updater) {
				updater.updateValue(valueName, value);
			}
		}
		
		if(value) {
			this._calendarNavigationExternalStorage.updateValue("month", value);
		}
		
		if(this._open.value) {
			this._open.value = false;
		}
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstInput("value", Wprr.source("propWithDots", valueName));
		
		return value;
	}
	
	_prepareRender() {
		super._prepareRender();
		
		let value = this.getValue();
		
		let date = moment(value, 'YYYY-MM-DD', true);
		if(!date.isValid()) {
			date = moment(value, 'YYYY-MM-DDTHH:mm', true);
		}
		
		if(date.isValid()) {
			this._value.value = date.format("Y-MM-DD");
		}
		else {
			this._value.value = null;
		}
	}
	
	_renderMainElement() {
		console.log("DateSelection::_renderMainElement");
		
		let language = this.getFirstInput(Wprr.sourceReference("wprr/postData", "language"), "en");
		
		let buttonClasses = this.getFirstInputWithDefault(Wprr.sourceProp("buttonClasses"), "cursor-pointer");
		//date-selection-button date-selection-button-padding
		
		let buttonMarkup = React.createElement("div", {className: buttonClasses},
			React.createElement(Wprr.HasData, {check: this._value},
				React.createElement(Wprr.FlexRow, {className: "justify-between micro-item-spacing date-selection-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize"},
					React.createElement("div", {className: "date-selection-number"},
						React.createElement(Wprr.DateDisplay, {date: this._value, format: "D"})
					),
					React.createElement("div", null,
						React.createElement("div", {className: "date-selection-month"},
							React.createElement(Wprr.DateDisplay, {date: this._value, format: "MMMM, Y", locale: language})
						),
						React.createElement("div", {className: "date-selection-weekday"},
							React.createElement(Wprr.DateDisplay, {date: this._value, format: "dddd", locale: language})
						)
					)
				)
			),
			React.createElement(Wprr.HasData, {check: this._value, checkType: "invert/default"},
				React.createElement("div", {className: "date-selection-month none-selected"},
					Wprr.idText("Select date", "site.selectDate")
				)
			)
		);
		
		return React.createElement("wrapper", null,
				React.createElement(Wprr.DropdownSelection, {"value": this._value, "open": this._open},
					React.createElement(Wprr.MarkupPlacement, {placement: "button"}, buttonMarkup),
					React.createElement(Wprr.MarkupPlacement, {placement: "overlay"},
						React.createElement("div", {className: "date-selection-overlay date-selection-overlay-padding"},
							React.createElement(Wprr.FlexRow, {className: "justify-between"},
								React.createElement(Wprr.EditableProps, {editableProps: "month", externalStorage: this._calendarNavigationExternalStorage},
									React.createElement(Wprr.CommandButton, {commands: Wprr.commands.stepValue(Wprr.sourceReference("value/month"), "month", Wprr.sourceProp("month"), -1, DateSelection.stepMonth)},
										React.createElement("div", {className: "cursor-pointer"}, "<")
									)
								),
								React.createElement(Wprr.EditableProps, {editableProps: "month", externalStorage: this._calendarNavigationExternalStorage},
									React.createElement(Wprr.DateDisplay, {date: Wprr.sourceProp("month"), format: "MMMM, Y", locale: language})
								),
								React.createElement(Wprr.EditableProps, {editableProps: "month", externalStorage: this._calendarNavigationExternalStorage},
									React.createElement(Wprr.CommandButton, {commands: Wprr.commands.stepValue(Wprr.sourceReference("value/month"), "month", Wprr.sourceProp("month"), 1, DateSelection.stepMonth)},
										React.createElement("div", {className: "cursor-pointer"}, ">")
									)
								)
							),
							React.createElement("div", {className: "spacing small"}),
							React.createElement(Wprr.EditableProps, {editableProps: "month", externalStorage: this._calendarNavigationExternalStorage},
								React.createElement(Wprr.Calendar, {value: this._value, firstSelectableDate: this.getFirstInput("firstSelectableDate")})
							)
						)
					)
				)
		);
	}
	
	static stepMonth(aValue, aStep, aCommand) {
		let month = moment(aValue).date(1).add(aStep, "month");
		return month;
	}
}

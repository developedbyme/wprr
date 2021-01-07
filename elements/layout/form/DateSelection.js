import React from "react";
import Wprr from "wprr";

import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

//import DateSelection from "./DateSelection";
export default class DateSelection extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("date-selection");
		
		this._calendarNavigationExternalStorage = new Wprr.utils.DataStorage();
		
		let monthDate = moment().format("YYYY-MM-DD");
		this._calendarNavigationExternalStorage.updateValue("month", monthDate);
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", Wprr.source("propWithDots", valueName));
		
		return value;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let value = this.getValue();
		
		let date = moment(value, 'YYYY-MM-DD', true);
		if(!date.isValid()) {
			date = moment(value, 'YYYY-MM-DDTHH:mm', true);
		}
		
		if(date.isValid()) {
			this._calendarNavigationExternalStorage.updateValue("month", date);
		}
		
	}
	
	_renderMainElement() {
		console.log("DateSelection::_renderMainElement");
		
		let matchField = this.getSourcedProp("matchField")
		let valueName = this.getSourcedProp("valueName");
		let value = this.getValue();
		
		let date = moment(value, 'YYYY-MM-DD', true);
		if(!date.isValid()) {
			date = moment(value, 'YYYY-MM-DDTHH:mm', true);
		}
		
		let postData = this.getReference("wprr/postData");
		let language = postData ? postData.getDataValue("language") : "en";
		
		let buttonClasses = this.getFirstInputWithDefault("cursor-pointer");
		//date-selection-button date-selection-button-padding
		
		return React.createElement("wrapper", null,
			React.createElement(Wprr.EditableProps, {editableProps: "open", open: false},
				React.createElement(Wprr.DropdownSelection, {valueName: valueName, name: "date"},
					React.createElement(Wprr.MarkupPlacement, {placement: "button"},
						React.createElement("div", {className: buttonClasses},
							React.createElement(Wprr.HasData, {check: date.isValid()},
								React.createElement(Wprr.FlexRow, {className: "justify-between micro-item-spacing date-selection-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize"},
									React.createElement("div", {className: "date-selection-number"},
										React.createElement(Wprr.DateDisplay, {date: value, format: "D"})
									),
									React.createElement("div", null,
										React.createElement("div", {className: "date-selection-month"},
											React.createElement(Wprr.DateDisplay, {date: value, format: "MMMM, Y", locale: language})
										),
										React.createElement("div", {className: "date-selection-weekday"},
											React.createElement(Wprr.DateDisplay, {date: value, format: "dddd", locale: language})
										)
									)
								)
							),
							React.createElement(Wprr.HasData, {check: date.isValid(), checkType: "invert/default"},
								React.createElement("div", {className: "date-selection-month none-selected"},
									Wprr.idText("Select date", "site.selectDate")
								)
							)
						)
					),
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
								React.createElement(Wprr.Calendar, {valueName: "selection", value: value, changeCommands: [Wprr.commands.setValue(Wprr.sourceReference("value/month"), "month", Wprr.sourceReference("calendar/day/date"))]})
							)
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

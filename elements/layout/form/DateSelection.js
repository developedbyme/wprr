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
		let language = postData ? postData.getDataValue("language") : "sv";
		
		let buttonClasses = this.getFirstInputWithDefault("cursor-pointer");
		//date-selection-button date-selection-button-padding
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "open",
  open: false
}, /*#__PURE__*/React.createElement(Wprr.DropdownSelection, {
  valueName: valueName,
  name: "date"
}, /*#__PURE__*/React.createElement(Wprr.MarkupPlacement, {
  placement: "button"
}, /*#__PURE__*/React.createElement("div", {
  className: buttonClasses
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: date.isValid()
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between micro-item-spacing date-selection-spacing vertically-center-items",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement("div", {
  className: "date-selection-number"
}, /*#__PURE__*/React.createElement(Wprr.DateDisplay, {
  date: value,
  format: "D"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "date-selection-month"
}, /*#__PURE__*/React.createElement(Wprr.DateDisplay, {
  date: value,
  format: "MMMM, Y",
  locale: language
})), /*#__PURE__*/React.createElement("div", {
  className: "date-selection-weekday"
}, /*#__PURE__*/React.createElement(Wprr.DateDisplay, {
  date: value,
  format: "dddd",
  locale: language
}))))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: date.isValid(),
  checkType: "invert/default"
}, /*#__PURE__*/React.createElement("div", {
  className: "date-selection-month"
}, Wprr.translateText("Välj datum"))))), /*#__PURE__*/React.createElement(Wprr.MarkupPlacement, {
  placement: "overlay"
}, /*#__PURE__*/React.createElement("div", {
  className: "date-selection-overlay date-selection-overlay-padding"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "month",
  externalStorage: this._calendarNavigationExternalStorage
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.stepValue(Wprr.sourceReference("value/month"), "month", Wprr.sourceProp("month"), -1, DateSelection.stepMonth)
}, /*#__PURE__*/React.createElement("div", {
  className: "cursor-pointer"
}, "<"))), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "month",
  externalStorage: this._calendarNavigationExternalStorage
}, /*#__PURE__*/React.createElement(Wprr.DateDisplay, {
  date: Wprr.sourceProp("month"),
  format: "MMMM, Y",
  locale: language
})), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "month",
  externalStorage: this._calendarNavigationExternalStorage
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.stepValue(Wprr.sourceReference("value/month"), "month", Wprr.sourceProp("month"), 1, DateSelection.stepMonth)
}, /*#__PURE__*/React.createElement("div", {
  className: "cursor-pointer"
}, ">")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "month",
  externalStorage: this._calendarNavigationExternalStorage
}, /*#__PURE__*/React.createElement(Wprr.Calendar, {
  valueName: "selection",
  value: value,
  changeCommands: [Wprr.commands.setValue(Wprr.sourceReference("value/month"), "month", Wprr.sourceReference("calendar/day/date"))]
})))))));
	}
	
	static stepMonth(aValue, aStep, aCommand) {
		let month = moment(aValue).date(1).add(aStep, "month");
		return month;
	}
}

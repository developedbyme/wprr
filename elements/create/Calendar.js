import React from "react";
import moment from "moment";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import Loop from "wprr/elements/create/Loop";
import Markup from "wprr/markup/Markup";
import UseMarkup from "wprr/markup/UseMarkup";
import FlexRow from "wprr/elements/area/grid/FlexRow";

import SourceData from "wprr/reference/SourceData";
import DateDisplay from "wprr/elements/text/DateDisplay";
import TriggerButton from "wprr/elements/interaction/TriggerButton";
import CommandButton from "wprr/elements/interaction/CommandButton";

import Adjust from "wprr/manipulation/Adjust";
import ClassFromProp from "wprr/manipulation/adjustfunctions/ClassFromProp";
import SetValueCommand from "wprr/commands/basic/SetValueCommand";

//import Calendar from "wprr/elements/create/Calendar";
export default class Calendar extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("calendar");
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", Wprr.source("propWithDots", valueName));
		
		return value;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/create/Calendar::_renderMainElement");
		
		let defaultToday = moment();
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getValue();
		let parsedValue = moment(value, 'YYYY-MM-DD', true);
		
		let today = moment(this.getSourcedPropWithDefault("today", defaultToday.format("Y-MM-DD")));
		let month = this.getSourcedProp("month");
		if(!month || month === "") {
			month = parsedValue.isValid() ? parsedValue.format("Y-MM-[01]") : today.format("Y-MM-[01]");
		}
		else {
			month = moment(month).format("Y-MM-[01]");
		}
		
		let monthToRender = moment(month);
		let monthToRenderComparisonString = monthToRender.format("YMM");
		
		let startWeekDay = monthToRender.isoWeekday();
		let startDate = monthToRender.clone().subtract(startWeekDay-1, "d");
		let monthEnd = monthToRender.clone().add(1, "M").subtract(1, "d");
		let endWeekDay = monthEnd.isoWeekday();
		let endDate = monthEnd.clone().add(7-endWeekDay+1, "d");
		
		let weekDuration = moment.duration(endDate.diff(startDate));
		
		let weekDataArray = new Array();
		
		let weeksToDisplay = weekDuration.asWeeks();
		for(let i = 0; i < weeksToDisplay; i++) {
			let weekStartDate = startDate.clone().add(i*7, "d");
			let weekEndDate = weekStartDate.clone().add(6, "d");
			
			let currentData = new Object();
			
			currentData["startDate"] = weekStartDate.format("Y-MM-DD");
			currentData["endDate"] = weekEndDate.format("Y-MM-DD");
			
			let daysData = new Array(7);
			
			for(let j = 0; j < 7; j++) {
				let currentDayData = new Object();
				let day = weekStartDate.clone().add(j, "d");
				
				currentDayData["date"] = day.format("Y-MM-DD");
				
				let todayComparison = moment.duration(day.diff(today));
				let daysDifference = todayComparison.asDays();
				
				currentDayData["relativeDays"] = daysDifference;
				
				if(daysDifference === 0) {
					currentDayData["relativeDirection"] = 0;
				}
				else {
					currentDayData["relativeDirection"] = daysDifference/Math.abs(daysDifference);
				}
				
				let dayMonthComparisonString = day.format("YMM");
				if(dayMonthComparisonString === monthToRenderComparisonString) {
					currentDayData["relativeMonthDirection"] = 0;
				}
				else {
					currentDayData["relativeMonthDirection"] = (dayMonthComparisonString < monthToRenderComparisonString) ? -1 : 1;
				}
				
				daysData[j] = currentDayData;
			}
			
			currentData["days"] = daysData;
			
			weekDataArray.push(currentData);
		}
		
		let injectData = new Object();
		injectData["calendar/selectedDate"] = value;
		injectData["calendar/today"] = today.format("Y-MM-DD");
		injectData["calendar/month"] = monthToRender.format("Y-MM");
		
		injectData["calendar/rowMarkup"] = this.getSourcedPropWithDefault("rowMarkup", Calendar.DEFAULT_ROW_MARKUP);
		injectData["calendar/cellMarkup"] = this.getSourcedPropWithDefault("cellMarkup", Calendar.DEFAULT_CELL_MARKUP);
		
		injectData["calendar/valueName"] = valueName;
		
		injectData["calendar/firstSelectableDate"] = this.getFirstInputWithDefault("firstSelectableDate", Wprr.sourceReferenceIfExists("calendar/firstSelectableDate"), null);
		injectData["calendar/lastSelectableDate"] = this.getFirstInputWithDefault("lastSelectableDate", Wprr.sourceReferenceIfExists("calendar/lastSelectableDate"), null);
		
		let selectCommands = new Array();
		if(valueName) {
			selectCommands.push(SetValueCommand.create(
				Wprr.sourceReference(Wprr.source("combine", ["value/", Wprr.sourceReference("calendar/valueName")])),
				Wprr.sourceReference("calendar/valueName"),
				Wprr.sourceReference("calendar/day/date")
			));
		}
		
		let changeCommands = this.getSourcedProp("changeCommands");
		if(changeCommands) {
			selectCommands = selectCommands.concat(changeCommands);
		}
		
		injectData["calendar/selectCommands"] = selectCommands;
		
		return React.createElement("wrapper", {},
			React.createElement(ReferenceInjection, {"injectData": injectData, "key": month},
				React.createElement(Loop, {"input": weekDataArray, "contentCreator": Calendar._contentCreator_row, "spacingContentCreator": Wprr.sourceReferenceIfExists("calendar/rowSpacingContentCreator")})
			)
		);
	}
	
	static _contentCreator_row(aData, aKeyIndex, aReferences, aReturnArray) {
		
		let injectData = new Object();
		injectData["calendar/week/rawData"] = aData;
		injectData["calendar/week/days"] = aData.days;
		
		let returnObject = React.createElement(ReferenceInjection, {"key": "row-" + aKeyIndex, "injectData": injectData},
			React.createElement(UseMarkup, {"markup": Wprr.sourceReference("calendar/rowMarkup")})
		);
		
		aReturnArray.push(returnObject);
	}
	
	static _contentCreator_cell(aData, aKeyIndex, aReferences, aReturnArray) {
		
		let injectData = new Object();
		injectData["calendar/day/rawData"] = aData;
		injectData["calendar/day/date"] = aData.date;
		injectData["calendar/day/relativeDirection"] = aData.relativeDirection;
		injectData["calendar/day/relativeMonthDirection"] = aData.relativeMonthDirection;
		
		let returnObject = React.createElement(ReferenceInjection, {"key": "row-" + aKeyIndex, "injectData": injectData},
			React.createElement(UseMarkup, {"markup": Wprr.sourceReference("calendar/cellMarkup")})
		);
		
		aReturnArray.push(returnObject);
	}
	
	static _adjust_isSelectedDate(aReturnObject, aManipulationObject) {
		//console.log("wprr/elements/create/Calendar::_adjust_isSelectedDate");
		//console.log(aManipulationObject.getReference("calendar/day/date"), aManipulationObject.getReference("calendar/selectedDate"), aManipulationObject.getReference("calendar/day/date") === aManipulationObject.getReference("calendar/selectedDate"))
		
		if(!aReturnObject["className"]) {
			aReturnObject["className"] = "";
		}
		
		let currentDate = aManipulationObject.getReference("calendar/day/date");
		if(currentDate === aManipulationObject.getReference("calendar/selectedDate")) {
			aReturnObject["className"] += " selected";
		}
		
		let selectable = true;
		let firstSelectableDate = aManipulationObject.getReferenceIfExists("calendar/firstSelectableDate");
		let lastSelectableDate = aManipulationObject.getReferenceIfExists("calendar/lastSelectableDate");
		
		if(firstSelectableDate && currentDate < firstSelectableDate) {
			selectable = false;
		}
		else if(lastSelectableDate && currentDate > lastSelectableDate) {
			selectable = false;
		}
		
		aReturnObject["className"] += " " + (selectable ? "selectable" : "unselectable");
		
		return aReturnObject;
	}
}

Calendar.DEFAULT_ROW_MARKUP = React.createElement(Markup, {},
	React.createElement(Loop, {"input": Wprr.sourceReference("calendar/week/days"), "contentCreator": Calendar._contentCreator_cell},
		React.createElement(FlexRow, {"className": "calendar-week uniform-item"})
	)
);

Calendar.DEFAULT_CELL_MARKUP = React.createElement(Markup, {},
	React.createElement(CommandButton, {"commands": 
		Wprr.sourceReference("calendar/selectCommands")
	},
		React.createElement(Adjust, {"adjust": [
			ClassFromProp.createWithSource(Wprr.sourceReference("calendar/day/relativeDirection"), [
				{"key": 0, "value": "today"},
				{"key": -1, "value": "past"},
				{"key": 1, "value": "future"}]
			),
			ClassFromProp.createWithSource(Wprr.sourceReference("calendar/day/relativeMonthDirection"), [
				{"key": 0, "value": "current-month"},
				{"key": -1, "value": "other-month past-month"},
				{"key": 1, "value": "other-month future-month"}]
			),
			Calendar._adjust_isSelectedDate
		]},
			React.createElement("div", {"className": "calendar-day"},
				React.createElement(DateDisplay, {"date": Wprr.sourceReference("calendar/day/date"), "format": "D"})
			)
		)
	)
);
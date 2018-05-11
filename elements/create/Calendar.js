import React from "react";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import Loop from "wprr/elements/create/Loop";
import Markup from "wprr/markup/Markup";
import UseMarkup from "wprr/markup/UseMarkup";
import FlexRow from "wprr/elements/area/grid/FlexRow";

import SourceData from "wprr/reference/SourceData";
import DateDisplay from "wprr/elements/text/DateDisplay";
import TriggerButton from "wprr/elements/interaction/TriggerButton";

import Adjust from "wprr/manipulation/Adjust";
import ClassFromProp from "wprr/manipulation/adjustfunctions/ClassFromProp";

//import Calendar from "wprr/elements/create/Calendar";
export default class Calendar extends WprrBaseObject {
	
	constructor(props) {
		super(props);
		
		
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/create/Calendar::_renderMainElement");
		
		let defaultToday = moment();
		
		let today = moment(this.getSourcedPropWithDefault("today", defaultToday.format("Y-MM-DD")));
		let monthToRender = moment(this.getSourcedPropWithDefault("date", today.format("Y-MM-[01]")));
		
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
		injectData["calendar/today"] = today.format("Y-MM-DD");
		injectData["calendar/month"] = monthToRender.format("Y-MM");
		
		injectData["calendar/rowMarkup"] = this.getSourcedPropWithDefault("rowMarkup", Calendar.DEFAULT_ROW_MARKUP);
		injectData["calendar/cellMarkup"] = this.getSourcedPropWithDefault("cellMarkup", Calendar.DEFAULT_CELL_MARKUP);
		
		injectData["calendar/triggerName"] = this.getSourcedPropWithDefault("triggerName", "date");
		
		return <wrapper>
			<ReferenceInjection injectData={injectData}>
				<Loop input={weekDataArray} contentCreator={Calendar._contentCreator_row} spacingContentCreator={SourceData.create("reference", "calendar/rowSpacingContentCreator")}/>
			</ReferenceInjection>
		</wrapper>;
	}
	
	static _contentCreator_row(aData, aKeyIndex, aReferences, aReturnArray) {
		
		let injectData = new Object();
		injectData["calendar/week/rawData"] = aData;
		injectData["calendar/week/days"] = aData.days;
		
		let returnObject = <ReferenceInjection key={"row-" + aKeyIndex} injectData={injectData}>
			<UseMarkup markup={SourceData.create("reference", "calendar/rowMarkup")} />
		</ReferenceInjection>;
		
		aReturnArray.push(returnObject);
	}
	
	static _contentCreator_cell(aData, aKeyIndex, aReferences, aReturnArray) {
		
		let injectData = new Object();
		injectData["calendar/day/rawData"] = aData;
		injectData["calendar/day/date"] = aData.date;
		injectData["calendar/day/relativeDirection"] = aData.relativeDirection;
		injectData["calendar/day/relativeMonthDirection"] = aData.relativeMonthDirection;
		
		let returnObject = <ReferenceInjection key={"row-" + aKeyIndex} injectData={injectData}>
			<UseMarkup markup={SourceData.create("reference", "calendar/cellMarkup")} />
		</ReferenceInjection>;
		
		aReturnArray.push(returnObject);
	}
	
	static _adjust_isSelectedDate(aReturnObject, aManipulationObject) {
		//console.log("wprr/elements/create/Calendar::_adjust_isSelectedDate");
		//console.log(aManipulationObject.getReference("calendar/day/date"), aManipulationObject.getReference("calendar/selectedDate"), aManipulationObject.getReference("calendar/day/date") === aManipulationObject.getReference("calendar/selectedDate"))
		
		if(aManipulationObject.getReference("calendar/day/date") === aManipulationObject.getReference("calendar/selectedDate")) {
			if(!aReturnObject["className"]) {
				aReturnObject["className"] = "";
			}
			
			aReturnObject["className"] += " selected";
		}
		
		return aReturnObject;
	}
}

Calendar.DEFAULT_ROW_MARKUP = <Markup>
	<Loop input={SourceData.create("reference", "calendar/week/days")} contentCreator={Calendar._contentCreator_cell}>
		<FlexRow className="calendar-week" />
	</Loop>
</Markup>;

Calendar.DEFAULT_CELL_MARKUP = <Markup>
	<TriggerButton triggerName={SourceData.create("reference", "calendar/triggerName")} triggerData={SourceData.create("reference", "calendar/day/date")}>
		<Adjust adjust={[
			ClassFromProp.createWithSource(SourceData.create("reference", "calendar/day/relativeDirection"), [
				{"key": 0, "value": "today"},
				{"key": -1, "value": "past"},
				{"key": 1, "value": "future"}]
			),
			ClassFromProp.createWithSource(SourceData.create("reference", "calendar/day/relativeMonthDirection"), [
				{"key": 0, "value": "current-month"},
				{"key": -1, "value": "other-month past-month"},
				{"key": 1, "value": "other-month future-month"}]
			),
			Calendar._adjust_isSelectedDate
		]}>
			<div className="calendar-day"><DateDisplay date={SourceData.create("reference", "calendar/day/date")} format="D" /></div>
		</Adjust>
	</TriggerButton>
</Markup>;
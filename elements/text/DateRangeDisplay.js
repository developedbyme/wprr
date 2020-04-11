import React from "react";
import Wprr from "wprr/Wprr";

import SourcedText from "wprr/elements/text/SourcedText";

import moment from "moment";

//import DateRangeDisplay from "wprr/elements/text/DateRangeDisplay";
export default class DateRangeDisplay extends SourcedText {

	constructor(props) {
		super(props);
	}
	
	_getText() {
		
		let startDate = this.getSourcedProp("startDate");
		let endDate = this.getSourcedProp("endDate");
		let inputType = this.getSourcedProp("inputType");
		let format = this.getSourcedProp("format");
		let locale = this.getFirstInputWithDefault("locale", Wprr.sourceReferenceIfExists("locale"), Wprr.sourceReferenceIfExists("wprr/postData", "language"), Wprr.sourceReferenceIfExists("wprr/pageData", "queryData.language"), "en");
		
		if(inputType === "php") {
			startDate = 1000*startDate;
			endDate = 1000*endDate;
		}
		
		let startDateText = DateRangeDisplay.momentFunction(startDate).locale(locale).format(format);
		let endDateText = DateRangeDisplay.momentFunction(endDate).locale(locale).format(format);
		
		let startArray = startDateText.split(" ");
		let endArray = endDateText.split(" ");
		
		let shareParts = new Array();
		
		let maxLength = Math.min(startArray.length, endArray.length);
		for(let i = 0; i < maxLength; i++) {
			let currentStart = startArray[startArray.length-1];
			let currentEnd = endArray[endArray.length-1];
			
			if(currentStart === currentEnd) {
				shareParts.unshift(currentStart);
				startArray.pop();
				endArray.pop();
			}
		}
		
		if(startArray.length === 0) {
			return shareParts.join(" ");
		}
		
		let ending = "";
		if(shareParts.length > 0) {
			ending = " " + shareParts.join(" ");
		}
		
		let startString = startArray.join(" ");
		let endString = endArray.join(" ");
		
		if(startString[startString.length-1] === "," && endString[endString.length-1] === ",") {
			startString = startString.substring(0, startString.length-1);
			endString = endString.substring(0, endString.length-1);
			ending = "," + ending;
		}
		
		let returnText = startString + " - " + endString + ending;
		
		return returnText;
	}
}

DateRangeDisplay.momentFunction = moment;
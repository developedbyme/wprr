import React from "react";

import SourcedText from "wprr/elements/text/SourcedText";

import moment from "moment";

//import RelativeDateDisplay from "wprr/elements/text/RelativeDateDisplay";
export default class RelativeDateDisplay extends SourcedText {

	constructor(props) {
		super(props);
	}
	
	_getText() {
		
		let input = this.getSourcedProp("date");
		let today = RelativeDateDisplay.momentFunction(this.getSourcedPropWithDefault("today", RelativeDateDisplay.momentFunction().format("Y-MM-DD")));
		let formats = this.getSourcedPropWithDefault("formats", {
			"sameDay": "[Today]",
			"nextDay": "[Tomorrow]",
			"nextWeek": "dddd",
			"lastDay": "[Yesterday]",
			"lastWeek": "[Last] dddd",
			"sameElse": "MMMM D, Y"
		});
		
		let returnText = RelativeDateDisplay.momentFunction(input).calendar(RelativeDateDisplay.momentFunction(today), formats);
		
		return returnText;
	}
}

RelativeDateDisplay.momentFunction = moment;
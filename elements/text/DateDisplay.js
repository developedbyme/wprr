import React from "react";

import SourcedText from "wprr/elements/text/SourcedText";

import moment from "moment";

//import DateDisplay from "wprr/elements/text/DateDisplay";
export default class DateDisplay extends SourcedText {

	constructor(props) {
		super(props);
	}
	
	_getText() {
		
		let input = this.getSourcedProp("date");
		let format = this.getSourcedProp("format");
		
		let returnText = DateDisplay.momentFunction(input).format(format);
		
		return returnText;
	}
}

DateDisplay.momentFunction = moment;
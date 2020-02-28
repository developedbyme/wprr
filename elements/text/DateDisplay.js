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
		let inputType = this.getSourcedProp("inputType");
		let format = this.getSourcedProp("format");
		let locale = this.getSourcedProp("locale");
		
		if(inputType === "php") {
			input = 1000*input;
		}
		
		let moment = DateDisplay.momentFunction(input);
		if(locale) {
			moment = moment.clone().locale(locale);
		}
		
		let returnText = moment.format(format);
		
		return returnText;
	}
}

DateDisplay.momentFunction = moment;
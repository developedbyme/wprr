import React from "react";

import SourcedText from "wprr/elements/text/SourcedText";

//import NumberDisplay from "wprr/elements/text/NumberDisplay";
export default class NumberDisplay extends SourcedText {

	constructor(props) {
		super(props);
	}
	
	_padNumber(aNumber, aMinLength) {
		
	}
	
	_getText() {
		
		let input = this.getSourcedProp("number");

		let format = this.getSourcedProp("format");
		
		let flooredNumber = Math.floor(input);
		let decimals = input-flooredNumber;
		
		let workNumber = flooredNumber;
		
		let returnString = "" + flooredNumber;
		let length = returnString.length;
		
		let dividers = [
			{"position": 3, "character": " "},
			{"position": 6, "character": " "}
		];
		
		let currentArray = dividers;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentDivider = currentArray[i];
			if(length > currentDivider["position"]) {
				returnString = returnString.substring(0, length-currentDivider["position"]) + currentDivider["character"] + returnString.substring(length-currentDivider["position"]);
			}
		}
		
		return returnString;
	}
}
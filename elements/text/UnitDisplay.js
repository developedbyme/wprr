import React from "react";

import SourcedText from "wprr/elements/text/SourcedText";

//import UnitDisplay from "wprr/elements/text/UnitDisplay";
export default class UnitDisplay extends SourcedText {

	constructor(props) {
		super(props);
	}
	
	_applyOptionToValue(aValue, aOption) {
		let newValue = aValue/aOption.step;
		
		let numberOfDecimals = this.getSourcedPropWithDefault("numberOfDecimals", 1);
		if(aOption.numberOfDecimals !== undefined && aOption.numberOfDecimals !== null) {
			numberOfDecimals = aOption.numberOfDecimals;
		}
		
		if(numberOfDecimals >= 0) {
			let multiplier = Math.pow(10, numberOfDecimals);
			newValue = Math.round(multiplier*newValue)/multiplier;
		}
		
		return newValue;
	}
	
	_getOptionLimit(aOption) {
		if(aOption.limit) {
			return aOption.limit;
		}
		return aOption.step;
	}
	
	_getText() {
		
		let value = 1*this.getSourcedProp("value");
		let options = this.getSourcedProp("options");
		
		let currentArray = options;
		let currentArrayLength = currentArray.length;
		
		
		let lastOption = currentArray[currentArrayLength-1];
		let displayValue = this._applyOptionToValue(value, lastOption);
		let displayUnit = lastOption["unit"];
		
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOption = currentArray[i]
			if(value >= this._getOptionLimit(currentOption)) {
				displayValue = this._applyOptionToValue(value, currentOption);
				displayUnit = currentOption["unit"];
				
				break;
			}
		}
		
		let spacing = this.getSourcedPropWithDefault("spacing", " ");
		
		let returnText = displayValue + spacing + displayUnit;
		
		return returnText;
	}
}
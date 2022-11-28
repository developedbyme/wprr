import React from "react";
import Wprr from "wprr/Wprr";

import TextWithReplacements from "wprr/elements/text/TextWithReplacements";

import ConditionEvaluation from "wprr/utils/logic/ConditionEvaluation";

//import AmountDependingText from "wprr/elements/text/AmountDependingText";
export default class AmountDependingText extends TextWithReplacements {

	constructor(props) {
		super(props);
	}
	
	getReplacements() {
		
		let amount = this.getSourcedProp("amount");
		let amountKeyword = this.getFirstInputWithDefault("amountKeyword", "{amount}");
		
		let replacements = super.getReplacements();
		replacements.push({"key": amountKeyword, "value": amount});
		
		return replacements;
	}
	
	_getRawText() {
		
		let amount = this.getSourcedProp("amount");
		let texts = this.getSourcedProp("texts");
		
		let currentArray = texts;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentText = this.resolveSourcedData(currentArray[i]);
			//console.log(amount, this.resolveSourcedData(currentText.condition), this.resolveSourcedData(currentText.amount));
			if(ConditionEvaluation.evaluateCondition(amount, this.resolveSourcedData(currentText.condition), this.resolveSourcedData(currentText.amount))) {
				return this.resolveSourcedData(currentText.text);
			}
		}
		
		return super._getRawText();
	}
}
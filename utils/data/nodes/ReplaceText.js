import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ReplaceText from "./ReplaceText";
export default class ReplaceText extends BaseObject {
	
	constructor() {
		super();
		
		this._updateReplacedTextCommand = Wprr.commands.callFunction(this, this._updateReplacedText);
		
		this.createSource("text", "").addChangeCommand(this._updateReplacedTextCommand);
		this.createSource("replacedText", "");
		
		this.createSource("replacements", []).addChangeCommand(this._updateReplacedTextCommand);
	}
	
	addReplacement(aKey, aValue) {
		//console.log("addReplacement");
		//console.log(aKey, aValue);
		
		this.createSource(aKey, aValue).addChangeCommand(this._updateReplacedTextCommand);
		
		let replacements = [].concat(this.replacements);
		replacements.push(aKey);
		this.replacements = replacements;
	}
	
	_updateReplacedText() {
		//console.log("_updateReplacedText");
		//console.log(this);
		
		let currentText = this.text;
		
		if(currentText) {
			let currentArray = this.replacements;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentKey = currentArray[i];
				let currentValue = this[currentKey];
				
				if(currentValue !== null && currentValue !== undefined) {
					currentText = currentText.split(currentKey).join(currentValue);
				}
			}
		}
		
		this.replacedText = currentText;
	}
}
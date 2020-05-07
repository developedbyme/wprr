import React from "react";
import Wprr from "wprr/Wprr";

import SourcedText from "wprr/elements/text/SourcedText";

//import TranslationOrId from "wprr/elements/text/TranslationOrId";
export default class TranslationOrId extends SourcedText {

	constructor(aProps) {
		super(aProps);
	}
	
	_getText() {
		
		let id = this.getSourcedProp("id");
		let prefix = this.getSourcedProp("prefix");
		let suffix = this.getSourcedProp("suffix");
		let defaultText = this.getFirstInput("defaultText", "id");
		
		let fullPath = id;
		if(suffix) {
			fullPath = fullPath + "." + suffix;
		}
		
		let paths = [];
		if(prefix) {
			let currentArray = Wprr.utils.array.arrayOrSeparatedString(prefix);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				paths.push(currentArray[i] + "." + fullPath);
			}
			
		}
		else {
			paths.push(fullPath);
		}
		
		let textManager = this.getReference("wprr/textManager");
		let translatedText = textManager.getFirstExistingText(paths, defaultText);
		
		return translatedText;
	}
}
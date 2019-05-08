import React from "react";
import Wprr from "wprr/Wprr";

import SourcedText from "wprr/elements/text/SourcedText";

//import TextWithReplacements from "wprr/elements/text/TextWithReplacements";
export default class TextWithReplacements extends SourcedText {

	constructor(props) {
		super(props);
	}
	
	_getText() {
		
		let text = this.getSourcedProp("text");
		
		let replacements = this.getSourcedProp("replacements");
		if(replacements) {
			replacements = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(replacements);
			let currentArray = replacements;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
			
				let currentReplacement = currentArray[i];
				let key = this.resolveSourcedData(currentReplacement["key"]);
				let value = this.resolveSourcedData(currentReplacement["value"]);
			
				text = text.split(key).join(value);
			}
		}
		
		return text;
	}
}
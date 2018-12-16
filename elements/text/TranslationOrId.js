import React from "react";

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
		
		let fullPath = id;
		if(prefix) {
			fullPath = prefix + "." + fullPath;
		}
		if(suffix) {
			fullPath = fullPath + "." + suffix;
		}
		
		let textManager = this.getReference("wprr/textManager");
		let translatedText = textManager.getTextOrId(fullPath, id);
		
		return translatedText;
	}
}
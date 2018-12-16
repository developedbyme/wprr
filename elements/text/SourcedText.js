import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

//import SourcedText from "wprr/elements/text/SourcedText";
export default class SourcedText extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._mainElementType = "span";
	}
	
	_getText() {
		return this.getSourcedProp("text");
	}
	
	_getMainElementProps() {
		let returnObject = super._getMainElementProps();
		
		if(this.getSourcedProp("format") === "html") {
			returnObject["dangerouslySetInnerHTML"] = {"__html": this._getText()};
		}
		
		return returnObject;
	}
	
	//METODO: update to new text return
	_renderMainElement() {
		
		if(this.getSourcedProp("format") === "html") {
			return React.createElement("wrapper");
		}
		
		return SourcedText.escapeString(this._getText());
	}
	
	static escapeString(aText) {
		if(!SourcedText.tempTextArea) {
			SourcedText.tempTextArea = document.createElement("textarea");
		}
		
		SourcedText.tempTextArea.innerHTML = aText;
		return SourcedText.tempTextArea.value;
	}
}

SourcedText.tempTextArea = null;
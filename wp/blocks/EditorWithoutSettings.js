"use strict";

import React from "react";

import Wprr from "wprr/Wprr";
import WprrBaseObject from "wprr/WprrBaseObject";

// import EditorWithoutSettings from "wprr/wp/blocks/EditorWithoutSettings";
export default class EditorWithoutSettings extends WprrBaseObject {
	
	/**
	 * Constructor
	 */
	constructor(aProps) {
		//console.log("wprr/wp/blocks/EditorWithoutSettings::constructor");
		
		super(aProps);
		
		this._addMainElementClassName("block-border block-padding");
	}
	
	_renderMainElement() {
		//console.log("wprr/wp/blocks/EditorWithoutSettings::_renderMainElement");
		
		let editorName = this.getSourcedProp("editorName", "Unknown")
		
		return React.createElement("wrapper", {},
			React.createElement("h2", {"className": "block-title"},
				Wprr.text(editorName)
			)
		);
	}
}
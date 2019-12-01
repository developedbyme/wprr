import React from "react";

import NativeElementArea from "wprr/elements/area/NativeElementArea";

//import HtmlArea from "wprr/elements/area/HtmlArea";
export default class HtmlArea extends NativeElementArea {

	constructor(aProps) {
		super(aProps);
		
		this._lastImplementedHtml = null;
	}
	
	_updateRender() {
		
		let html = this.getSourcedProp("html");
		
		if(html !== this._lastImplementedHtml) {
			this._lastImplementedHtml = html;
			this._element.innerHTML = html;
		}
		
		super._updateRender();
	}
}

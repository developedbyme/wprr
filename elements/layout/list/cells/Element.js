import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Element extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-element");
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null,
			React.createElement("div", {className: "label-text-small"},
				React.createElement(Wprr.TranslationOrId, {id: type, prefix: "site.messageGroupFields"})
			),
			React.createElement("div", {className: "spacing micro"}),
			React.createElement(Wprr.InsertElement, {element: Wprr.sourceReference("cellSettings", "element")})
		);
	}
}
import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Standard extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-standard");
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null,
			React.createElement("div", {className: "label-text-small"},
				React.createElement(Wprr.TranslationOrId, {id: type, prefix: "site.messageGroupFields"})
			),
			React.createElement("div", {className: "spacing micro"}),
			React.createElement("div", {className: "content-text-small"},
				Wprr.text(Wprr.sourceReference("item", "messageGroup." + type))
			)
		);
	}
}
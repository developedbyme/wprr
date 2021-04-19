import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Data extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-data");
	}
	
	_renderMainElement() {
		
		let fieldId = this.getFirstInput("fieldId", Wprr.sourceReference("cellId"));
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		let label = this.getFirstInputWithDefault("label", Wprr.sourceReference("cellSettings", "label"), Wprr.sourceText("site.messageGroupFields." + fieldId), fieldId);
		
		return React.createElement("div", null,
			React.createElement("div", {className: "label-text-small"},
				Wprr.text(label),
				React.createElement("div", {className: "spacing micro"}),
				React.createElement("div", {className: "content-text-small"},
					Wprr.text(Wprr.sourceReference("item", "data." + fieldId))
				)
			)
		);
	}
}
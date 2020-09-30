import Wprr from "wprr";
import React from "react";

import Layout from "wprr/elements/layout/Layout";

export default class Name extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "displayFields_name";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {}, 
			Wprr.text(Wprr.sourceReference("field", "field.value.firstName")),
			" ",
			Wprr.text(Wprr.sourceReference("field", "field.value.lastName"))
		);
	}
}
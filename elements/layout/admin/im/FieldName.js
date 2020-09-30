"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

//import FieldName from "./FieldName";
export default class FieldName extends Layout {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getLayout(aSlots) {
		
		let fieldName = aSlots.prop("fieldName", Wprr.sourceReference("field", "field.key"));
		
		return React.createElement(Wprr.TranslationOrId, {"id": fieldName, "prefix": aSlots.prop("prefix", "site.messageGroupFields")});
	}
}

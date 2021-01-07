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
		
		let fieldName = Wprr.sourceFirst(aSlots.prop("fieldName", null), Wprr.sourceReference("field", "field.key"));
		
		return React.createElement(Wprr.TranslationOrId, {"id": fieldName, "prefix": aSlots.prop("prefix", "site.messageGroupFields")});
	}
}

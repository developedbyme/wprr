import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import RelatedItem from "wprr/reference/RelatedItem";

//import SelectField from "wprr/reference/SelectField";
export default class SelectField extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/reference/SelectField::_removeUsedProps");
		
		delete aReturnObject["fieldName"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		let children = this.getProps()["children"];
		
		let fieldName = this.getFirstInput("fieldName");
		
		return React.createElement(RelatedItem, {"id": "fieldByName." + fieldName, "as": "field"}, 
			React.createElement(RelatedItem, {"id": "editStorage", "from": Wprr.sourceReference("field"), "as": "field/externalStorage"}, children)
		);
	}
}

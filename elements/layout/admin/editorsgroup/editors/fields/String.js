import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class String extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		
		let fieldName = this.getFirstInput("fieldName");
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {"data": Wprr.sourceReference("itemEditor", "fieldEditor." + fieldName), "as": "valueEditor"},
				React.createElement(Wprr.FormField, {"className": "standard-field standard-field-padding full-width", "value": Wprr.sourceReference("valueEditor", "valueSource")}),
				React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
			)
		);
	}
}

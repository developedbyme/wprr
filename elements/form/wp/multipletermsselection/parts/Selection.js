import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

// import Selection from "wprr/elements/form/wp/Selection";
export default class Selection extends WprrBaseObject {
	
	constructor() {
		super();
	}
	
	_renderMainElement() {
		
		let selectionValue = this.getFirstInput("selectionValue");
		
		return React.createElement(Wprr.MultipleSelectionValue, {"value": selectionValue, "fieldName": "value", "externalStorage": Wprr.sourceReference("externalStorage")},
			React.createElement(Wprr.Checkbox, {"valueName": "selected"})
		);
	}
}
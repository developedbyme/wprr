import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class DateSelection extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
			React.createElement(Wprr.layout.form.DateSelection, {valueName: "value", className: "standard-field standard-field-padding full-width"})
		);
	}
}
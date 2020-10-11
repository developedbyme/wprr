import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class TextArea extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
			React.createElement(Wprr.TextArea, {valueName: "value", className: "standard-field standard-field-padding full-width"})
		);
	}
}
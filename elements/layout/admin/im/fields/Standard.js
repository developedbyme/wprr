import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Standard extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.EditableProps, {
  editableProps: "value",
  externalStorage: Wprr.sourceReference("field/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: "value",
  className: "standard-field standard-field-padding full-width"
}));
	}
}
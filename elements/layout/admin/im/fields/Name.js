import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.SelectSection, {
  selectedSections: Wprr.sourceReference("field/externalStorage", "uiStatus.status")
}, /*#__PURE__*/React.createElement("div", {
  "data-section-name": "view",
  "data-default-section": true
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.setValue(Wprr.sourceReference("field/externalStorage"), "uiStatus.status", "edit")
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-field standard-field-padding full-width"
}, Wprr.text(Wprr.sourceReference("field/externalStorage", "value.firstName")), " ", Wprr.text(Wprr.sourceReference("field/externalStorage", "value.lastName"))))), /*#__PURE__*/React.createElement("div", {
  "data-section-name": "edit"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "halfs small-item-spacing"
}, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "value.firstName",
  externalStorage: Wprr.sourceReference("field/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: "value.firstName",
  className: "standard-field standard-field-padding full-width"
})), /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "value.lastName",
  externalStorage: Wprr.sourceReference("field/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  valueName: "value.lastName",
  className: "standard-field standard-field-padding full-width"
})))));
	}
}
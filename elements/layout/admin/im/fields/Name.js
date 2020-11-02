import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.SelectSection, {selectedSections: Wprr.sourceReference("field/externalStorage", "uiStatus.status")},
			React.createElement("div", {"data-section-name": "view", "data-default-section": true},
				React.createElement(Wprr.CommandButton, {commands: Wprr.commands.setValue(Wprr.sourceReference("field/externalStorage"), "uiStatus.status", "edit")},
					React.createElement("div", {className: "standard-field standard-field-padding full-width"},
						Wprr.text(Wprr.sourceReference("field/externalStorage", "value.firstName")),
						" ",
						Wprr.text(Wprr.sourceReference("field/externalStorage", "value.lastName"))
					)
				)
			),
			React.createElement("div", {"data-section-name": "edit"},
				React.createElement(Wprr.FlexRow, {className: "halfs small-item-spacing"},
					React.createElement(Wprr.EditableProps, {editableProps: "value.firstName", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.FormField, {valueName: "value.firstName", className: "standard-field standard-field-padding full-width"})
					),
					React.createElement(Wprr.EditableProps, {editableProps: "value.lastName", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.FormField, {valueName: "value.lastName", className: "standard-field standard-field-padding full-width"})
					)
				)
			)
		);
	}
}
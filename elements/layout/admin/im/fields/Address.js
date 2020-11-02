import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Address extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.SelectSection, {selectedSections: Wprr.sourceReference("field/externalStorage", "uiStatus.status")},
			React.createElement("div", {"data-section-name": "view", "data-default-section": true, className: "standard-field standard-field-padding full-width"},
				React.createElement(Wprr.CommandButton, {commands: Wprr.commands.setValue(Wprr.sourceReference("field/externalStorage"), "uiStatus.status", "edit")},
					React.createElement("div", {},
						Wprr.text(Wprr.sourceReference("field/externalStorage", "value.address1"))
					),
					React.createElement("div", {},
						Wprr.text(Wprr.sourceReference("field/externalStorage", "value.address2"))
					),
					React.createElement("div", {},
						Wprr.text(Wprr.sourceReference("field/externalStorage", "value.postCode")),
						" ",
						Wprr.text(Wprr.sourceReference("field/externalStorage", "value.city"))
					)
				)
			),
			React.createElement("div", {"data-section-name": "edit"},
				React.createElement("div", {},
					React.createElement(Wprr.EditableProps, {editableProps: "value.address1", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.FormField, {valueName: "value.address1", className: "standard-field standard-field-padding full-width"})
					)
				),
				React.createElement("div", {},
					React.createElement(Wprr.EditableProps, {editableProps: "value.address2", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.FormField, {valueName: "value.address2", className: "standard-field standard-field-padding full-width"})
					)
				),
				React.createElement(Wprr.FlexRow, {classAddress: "halfs small-item-spacing"},
					React.createElement(Wprr.EditableProps, {editableProps: "value.postCode", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.FormField, {valueName: "value.postCode", className: "standard-field standard-field-padding full-width"})
					),
					React.createElement(Wprr.EditableProps, {editableProps: "value.city", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.FormField, {valueName: "value.city", className: "standard-field standard-field-padding full-width"})
					)
				)
			)
		);
	}
}
import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-field");
	}
	
	_renderMainElement() {
		
		let fieldId = this.getFirstInput("fieldId", Wprr.sourceReference("cellId"));
		
		let cellSwitchableArea = Wprr.creators.SwitchableAreaCreator.createFromClasses(
			Wprr.sourceFunction(
				Wprr.utils.programmingLanguage,
				"convertHyphensToCamelCase",
				[
					Wprr.sourceReference("field", "data.type.slug")
				]
			),
			Wprr.layout.admin.im.fields.areas,
			"standard"
		);
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-text-small"
}, /*#__PURE__*/React.createElement(Wprr.TranslationOrId, {
  id: fieldId,
  prefix: "site.messageGroupFields"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing micro"
}), /*#__PURE__*/React.createElement("div", {
  className: "content-text-small"
}, /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: fieldId
}, cellSwitchableArea.getReactElements(), /*#__PURE__*/React.createElement(Wprr.layout.admin.im.SaveFieldOperations, null))));
	}
}
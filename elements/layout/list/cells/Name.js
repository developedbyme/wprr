import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Name extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-name");
	}
	
	_renderMainElement() {
		
		let fieldId = this.getFirstInput("fieldId", Wprr.sourceReference("column", "columnId"));
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-text-small"
}, /*#__PURE__*/React.createElement(Wprr.TranslationOrId, {
  id: fieldId,
  prefix: "site.messageGroupFields"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing micro"
}), /*#__PURE__*/React.createElement("div", {
  className: "content-text-small"
}, Wprr.text(Wprr.sourceReference("item", "messageGroup.name.firstName")), " ", Wprr.text(Wprr.sourceReference("item", "messageGroup.name.lastName"))));
	}
}
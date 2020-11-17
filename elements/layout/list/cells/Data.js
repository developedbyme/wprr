import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Data extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-data");
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-text-small"
}, /*#__PURE__*/React.createElement(Wprr.TranslationOrId, {
  id: type,
  prefix: "site.messageGroupFields"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing micro"
}), /*#__PURE__*/React.createElement("div", {
  className: "content-text-small"
}, Wprr.text(Wprr.sourceReference("item", "data." + type))));
	}
}
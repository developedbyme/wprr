import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class RelationName extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-relation-name");
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
}, /*#__PURE__*/React.createElement(Wprr.TermName, {
  termId: Wprr.sourceReference("item", "messageGroup." + type),
  taxonomy: "dbm_relation"
})));
	}
}
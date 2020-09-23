import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class RelationOfAnyType extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-relation-of-any-type");
	}
	
	_renderMainElement() {
		
		let type = this.getFirstInput("type", Wprr.sourceReference("loop/item"));
		
		let editorSource = Wprr.sourceReference("editor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		
		let editorPath = this.getFirstInput(Wprr.sourceCombine("relationEditors.", Wprr.sourceReference("cellSettings", "relationPath")));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "label-text-small"
}, /*#__PURE__*/React.createElement(Wprr.TranslationOrId, {
  id: type,
  prefix: "site.messageGroupFields"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing micro"
}), /*#__PURE__*/React.createElement("div", {
  className: "content-text-small"
}, /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
  id: editorPath,
  as: "editor"
}, /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: activatePathSource,
  externalStorage: externalStorageSource
}, /*#__PURE__*/React.createElement(Wprr.layout.relation.SelectRelationOfAnyType, null)))));
	}
}
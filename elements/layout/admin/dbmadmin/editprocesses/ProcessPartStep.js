"use strict";

import React from "react";
import Wprr from "wprr";

//import * as questionStepAreas from "../dropdownareas/question-step-areas.js";

export default class ProcessPartStep extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_prepareInitialRender() {
		
		super._prepareInitialRender();
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"));
		
		let itemsEditor = this.getFirstInput(Wprr.sourceReference("itemsEditor"));
		
		itemsEditor.enableEditsForItem(itemId);
	}
	
	componentWillUnmount() {
		
		super.componentWillUnmount();
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"));
		
		let itemsEditor = this.getFirstInput(Wprr.sourceReference("itemsEditor"));
		
		itemsEditor.enableEditsForItem(itemId);
	}

	_renderMainElement() {
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing flex-no-wrap"
}, /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "name"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: Wprr.sourceTranslation("Name", "site.fieldNames.name")
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null))), /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "identifier"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: Wprr.sourceTranslation("Identifier", "site.fieldNames.identifier")
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null))), /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "description"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: Wprr.sourceTranslation("Description", "site.fieldNames.description")
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null))), /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "type"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: Wprr.sourceTranslation("Type", "site.fieldNames.type")
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null))), /*#__PURE__*/React.createElement(Wprr.SelectField, {
  fieldName: "value"
}, /*#__PURE__*/React.createElement(Wprr.layout.form.LabelledArea, {
  label: Wprr.sourceTranslation("Data", "site.fieldNames.data")
}, /*#__PURE__*/React.createElement(Wprr.layout.admin.im.Field, null)))));
	}
}

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class LockedField extends Layout {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getLayout(aSlots) {
		
		return React.createElement(Wprr.layout.form.LabelledArea, {
  label: aSlots.prop("label", Wprr.sourceTranslation("Email", "site.email"))
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-field standard-field-padding uneditable"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing justify-between"
}, aSlots.default(Wprr.text(Wprr.sourceReference("externalStorage", aSlots.prop("fieldName", "email")))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "changeStep", [aSlots.prop("step", "changeEmail")])
}, /*#__PURE__*/React.createElement("div", {
  className: "action-link secondary cursor-pointer"
}, Wprr.idText("Change", "site.change"))))));
	}
}

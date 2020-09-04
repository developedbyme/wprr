"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import SaveAllButton from "./SaveAllButton";
export default class SaveAllButton extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("SaveAllButton::constructor");

		super();
		
		this._layoutName = "saveAllButton";
	}
	
	_getLayout(aSlots) {
		
		return React.createElement(Wprr.ExternalStorageProps, {
  props: "saveAll.hasChanges",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourcePropWithDots("saveAll.hasChanges")
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "saveAll", [])
}, aSlots.slot("buttonElement", /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding"
}, Wprr.text(aSlots.prop("saveAllText", Wprr.sourceTranslation("Save all changes"))))))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourcePropWithDots("saveAll.hasChanges"),
  checkType: "invert/default"
}, aSlots.slot("inactiveButtonElement", /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding inactive"
}, Wprr.text(aSlots.prop("noChangesText", Wprr.sourceTranslation("No changes to save")))))));
	}
}



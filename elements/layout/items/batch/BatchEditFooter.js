"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import BatchEditFooter from "./BatchEditFooter";
export default class BatchEditFooter extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "batchEditFooter";
	}

	_getLayout(aSlots) {
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, aSlots.slot("left", /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "createItem", [])
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding"
}, Wprr.translateText("Add"))))), aSlots.slot("right", /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: "saveAll.hasChanges",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourcePropWithDots("saveAll.hasChanges")
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "saveAll", [])
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding"
}, Wprr.translateText("Save all changes")))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourcePropWithDots("saveAll.hasChanges"),
  checkType: "invert/default"
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding inactive"
}, Wprr.translateText("No changes to save")))))));
	}
}

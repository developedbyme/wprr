"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import DisplayRelation from "./DisplayRelation";
export default class DisplayRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("DisplayRelation::constructor");

		super();
		
		this._layoutName = "displayRelation";
	}
	
	_getLayout(aSlots) {
		
		return 
React.createElement("div", {
  className: "object-relation"
}, React.createElement("div", {
  className: "flex-row pixel-item-spacing vertically-center-items"
}, aSlots.slot("idCell", React.createElement("div", {
  className: "flex-row-item"
}, React.createElement("div", {
  className: "standard-flag standard-flag-padding id-flag"
}, Wprr.text(Wprr.sourceReference("item", "id"))))), aSlots.slot("fromCell", React.createElement("div", {
  className: "flex-row-item"
}, React.createElement(Wprr.RelatedItem, {
  id: "from.linkedItem"
}, React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "data.title")))))), aSlots.slot("arrow", React.createElement("div", {
  className: "flex-row-item"
}, React.createElement("div", null, "->"))), aSlots.slot("toCell", React.createElement("div", {
  className: "flex-row-item"
}, React.createElement(Wprr.RelatedItem, {
  id: "to.linkedItem"
}, React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "data.title")))))), aSlots.slot("statusCell", React.createElement(Wprr.HasData, {
  check: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "status"),
  checkType: "equal",
  compareValue: "draft"
}, React.createElement("div", {
  className: "flex-row-item"
}, React.createElement("div", {
  className: "standard-flag standard-flag-padding status-flag draft"
}, "Draft")))), aSlots.slot("startFlagCell", React.createElement(Wprr.HasData, {
  check: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "startAt"),
  checkType: "positiveValue"
}, React.createElement("div", {
  className: "flex-row-item"
}, React.createElement("div", {
  className: "standard-flag standard-flag-padding start-at-flag"
}, "Start: ", React.createElement(Wprr.DateDisplay, {
  date: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "startAt"),
  format: "Y-MM-DD HH:mm:ss",
  inputType: "php"
}))))), aSlots.slot("endFlagCell", React.createElement(Wprr.HasData, {
  check: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "endAt"),
  checkType: "positiveValue"
}, React.createElement("div", {
  className: "flex-row-item"
}, React.createElement("div", {
  className: "standard-flag standard-flag-padding end-at-flag"
}, "End: ", React.createElement(Wprr.DateDisplay, {
  date: Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "endAt"),
  format: "Y-MM-DD HH:mm:ss",
  inputType: "php"
})))))));
	}
}
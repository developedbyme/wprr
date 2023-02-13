import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";
import Layout from "wprr/elements/layout/Layout";

export default class SelectRelationFromItems extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getLayout(aSlots) {
		//console.log("SelectRelationFromItemss::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, objectType]),
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceReference("valueEditor").deeper("singleEditor"),
		  as: "selectedEditor"
		}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
		  className: "standard-field standard-field-padding full-width"
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  checkType: "notEmpty"
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  as: "relation"
		}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
		  className: "small-item-spacing flex-no-wrap",
		  itemClasses: "flex-resize,flex-no-resize"
		}, /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
		  id: relationName,
		  from: Wprr.sourceReference("relation")
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")
		}, /*#__PURE__*/React.createElement("div", {
		  className: "cursor-pointer"
		}, aSlots.default( /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
		  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id")),
		  as: "itemLoader"
		}, /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "title")))))))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "endRelation", [Wprr.sourceReference("relation", "id")])
		}, /*#__PURE__*/React.createElement("div", {
		  className: "cursor-pointer"
		}, React.createElement(Wprr.Image, {
		  "className": "field-icon background-contain",
		  "src": "icons/remove-circle.svg"
		})))))), /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  checkType: "invert/notEmpty"
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")
		}, /*#__PURE__*/React.createElement("div", {
		  className: "cursor-pointer"
		}, Wprr.idText("Select", "site.select"))))), /*#__PURE__*/React.createElement(Wprr.SelectSection, {
		  selectedSections: this._elementTreeItem.getValueSource("mode")
		}, /*#__PURE__*/React.createElement("div", {
		  "data-default-section": true
		}), /*#__PURE__*/React.createElement("div", {
		  "data-section-name": "edit"
		}, /*#__PURE__*/React.createElement("div", {
		  className: "absolute-container"
		}, /*#__PURE__*/React.createElement(Wprr.layout.area.Overlay, {
		  open: true
		}, /*#__PURE__*/React.createElement("div", {
		  className: "autocomplete-popup"
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: this.getFirstInput("ids")
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: [Wprr.commands.callFunction(Wprr.sourceReference("selectedEditor"), "setValue", [Wprr.sourceReference("item", "id")]), Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")]
		}, /*#__PURE__*/React.createElement("div", {
		  className: "hover-row cursor-pointer standard-row-padding"
		}, aSlots.slot("searchResult", /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "id")))))))))))), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null))))
		);
	}
}

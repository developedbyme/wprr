import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SelectAnyRelation extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
		this._elementTreeItem.setValue("search", "");
		
		this._elementTreeItem.getValueSource("search").addChangeCommand(Wprr.commands.callFunction(this, this._performSearch));
		
		let singleResultLoader = this._elementTreeItem.addNode("singleResultLoader", new Wprr.utils.data.nodes.LoadDataRange());
		
		this._elementTreeItem.getLinks("singleResults").input(singleResultLoader.item.getLinks("items"));
	}
	
	_performSearch() {
		//console.log("_performSearch");
		
		let search = this._elementTreeItem.getValue("search");
		
		let singleResultLoader = Wprr.objectPath(this._elementTreeItem, "singleResultLoader.linkedItem.controller");
		//console.log(singleResultLoader, this._elementTreeItem);
		
		let numericSearch = 1*search;
		
		if(isNaN(numericSearch) || numericSearch != search) {
			singleResultLoader.setUrl(this.getWprrUrl("range/?select=search,anyStatus&encode=postTitle,postStatus,objectTypes&search=" + encodeURIComponent(search), "wprrData"));
		}
		else {
			singleResultLoader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,objectTypes&ids=" + numericSearch, "wprrData"));
		}
	}
	
	_renderMainElement() {
		//console.log("SelectAnyRelation::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "outgoing");
		let relationType = this.getFirstInputWithDefault("relationType", "pointing-to");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, "*"]),
		  as: "valueEditor"
		}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceReference("valueEditor").deeper("singleEditor"),
		  as: "selectedEditor"
		}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.SelectSection, {
		  selectedSections: this._elementTreeItem.getValueSource("mode")
		}, /*#__PURE__*/React.createElement("div", {
		  "data-default-section": true
		}, /*#__PURE__*/React.createElement("div", {
		  className: "standard-field standard-field-padding full-width"
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  checkType: "notEmpty"
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  as: "relation"
		}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
		  className: "small-item-spacing",
		  itemClasses: "flex-resize,flex-no-resize"
		}, /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
		  id: relationName,
		  from: Wprr.sourceReference("relation")
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")
		}, /*#__PURE__*/React.createElement("div", {
		  className: "cursor-pointer"
		}, /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
		  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id")),
		  as: "itemLoader"
		}, /*#__PURE__*/React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "title"))))))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
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
		}, Wprr.idText("Select", "site.select")))))), /*#__PURE__*/React.createElement("div", {
		  "data-section-name": "edit"
		}, /*#__PURE__*/React.createElement("div", {
		  className: "standard-field standard-field-padding full-width"
		}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
		  className: "small-item-spacing vertically-center-items",
		  itemClasses: "flex-resize,flex-no-resize"
		}, /*#__PURE__*/React.createElement(Wprr.FormField, {
		  autoFocus: true,
		  value: this._elementTreeItem.getValueSource("search"),
		  className: "integrated-field full-size"
		}), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")
		}, /*#__PURE__*/React.createElement("div", {
		  className: "cursor-pointer"
		}, React.createElement(Wprr.Image, {
		  "className": "field-icon background-contain",
		  "src": "icons/remove-circle.svg"
		}))))), /*#__PURE__*/React.createElement("div", {
		  className: "absolute-container"
		}, /*#__PURE__*/React.createElement(Wprr.layout.area.Overlay, {
		  open: true
		}, /*#__PURE__*/React.createElement("div", {
		  className: "autocomplete-popup"
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: this._elementTreeItem.getLinks("singleResults").idsSource
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: [Wprr.commands.callFunction(Wprr.sourceReference("selectedEditor"), "setValue", [Wprr.sourceReference("item", "id")]), Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")]
		}, /*#__PURE__*/React.createElement("div", {
		  className: "hover-row cursor-pointer standard-row-padding"
		}, Wprr.text(Wprr.sourceReference("item", "title")), " ", /*#__PURE__*/React.createElement("span", {
		  className: "post-id-description"
		}, "(", Wprr.text(Wprr.sourceReference("item", "id")), ")"))))))))), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null))))
		);
	}
}

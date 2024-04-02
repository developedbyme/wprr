import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SelectUserRelations extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
		this._elementTreeItem.setValue("search", "");
		
		let rangeLoader = this._elementTreeItem.addNode("rangeLoader", new Wprr.utils.data.nodes.LoadDataRange());
		
		this._elementTreeItem.getLinks("items").input(rangeLoader.item.getLinks("items"));
		
		rangeLoader.setUrl(this.getWprrUrl("users", "wprrData"));
		
		let filterItem = this._elementTreeItem.group.createInternalItem();
		let filteredList = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(filterItem);
		filterItem.getType("all").input(this._elementTreeItem.getLinks("items"));
		
		let searchFilterItem = filteredList.addFieldSearch("name.value,id");
		this._elementTreeItem.addSingleLink("searchFilter", searchFilterItem.id);
		searchFilterItem.getType("searchValue").input(this._elementTreeItem.getValueSource("search"));
		
		let sortItem = this._elementTreeItem.group.createInternalItem();
		let sort = Wprr.utils.data.multitypeitems.controllers.list.SortedList.create(sortItem);
		this._elementTreeItem.addSingleLink("sort", sortItem.id);
		
		let newSortItem = sort.addFieldSort("name.value", function(aValue) {return aValue});
		newSortItem.addType("element", React.createElement("div", {}, "By name"));
		newSortItem.setValue("buttonName", "title");
		
		sortItem.getLinks("all").input(filterItem.getLinks("filtered"));
		
		this._elementTreeItem.getLinks("sortedItems").input(sortItem.getType("sorted"));
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_renderMainElement() {
		//console.log("SelectUserRelations::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let relationType = this.getFirstInputWithDefault("relationType", "user-for");

		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(itemEditor, "getUserRelationEditor", [relationType]), as: "valueEditor"}, React.createElement("div", null,
		 React.createElement(Wprr.SelectSection, {
		  selectedSections: this._elementTreeItem.getValueSource("mode")
		}, React.createElement("div", {
		  "data-default-section": true
		}, React.createElement("div", {
		  className: "standard-field standard-field-padding full-width"
		}, React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  checkType: "notEmpty"
		}, React.createElement(Wprr.layout.ItemList, {
		  ids: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  as: "relation"
		}, React.createElement(Wprr.FlexRow, {
		  className: "small-item-spacing flex-no-wrap",
		  itemClasses: "flex-resize,flex-no-resize"
		}, React.createElement(Wprr.RelatedItem, {
		  id: "user.linkedItem",
		  from: Wprr.sourceReference("relation")
		}, React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")
		}, React.createElement("div", {
		  className: "cursor-pointer"
		}, React.createElement(Wprr.layout.loader.DataRangeLoader, {
		  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id")),
		  as: "itemLoader"
		}, React.createElement("div", null, Wprr.text(Wprr.sourceReference("item", "name"))))))), React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "endRelation", [Wprr.sourceReference("relation", "id")])
		}, React.createElement("div", {
		  className: "cursor-pointer"
		}, React.createElement(Wprr.Image, {
		  "className": "field-icon background-contain",
		  "src": "icons/remove-circle.svg"
		})))))), React.createElement(Wprr.HasData, {
		  check: Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource"),
		  checkType: "invert/notEmpty"
		}, React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")
		}, React.createElement("div", {
		  className: "cursor-pointer"
		}, Wprr.idText("Select", "site.select")))))), React.createElement("div", {
		  "data-section-name": "edit"
		}, React.createElement("div", {
		  className: "standard-field standard-field-padding full-width"
		}, React.createElement(Wprr.FlexRow, {
		  className: "small-item-spacing vertically-center-items",
		  itemClasses: "flex-resize,flex-no-resize"
		}, React.createElement(Wprr.FormField, {
		  autoFocus: true,
		  value: this._elementTreeItem.getValueSource("search"),
		  className: "integrated-field full-size"
		}), React.createElement(Wprr.CommandButton, {
		  commands: Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")
		}, React.createElement("div", {
		  className: "cursor-pointer"
		}, React.createElement(Wprr.Image, {
		  "className": "field-icon background-contain",
		  "src": "icons/remove-circle.svg"
		}))))), React.createElement("div", {
		  className: "absolute-container"
		}, React.createElement(Wprr.layout.area.Overlay, {
		  open: true
		}, React.createElement("div", {
		  className: "autocomplete-popup"
		}, React.createElement(Wprr.HasData, {
		  check: this._elementTreeItem.getLinks("sortedItems").idsSource,
		  checkType: "notEmpty"
		}, React.createElement(Wprr.layout.ItemList, {
		  ids: this._elementTreeItem.getLinks("sortedItems").idsSource
		}, React.createElement(Wprr.CommandButton, {
		  commands: [Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "createRelation", [Wprr.sourceReference("item", "id")]), Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")]
		}, React.createElement("div", {
		  className: "hover-row cursor-pointer standard-row-padding"
		}, Wprr.text(Wprr.sourceReference("item", "name")))))), React.createElement(Wprr.HasData, {
		  check: this._elementTreeItem.getLinks("sortedItems").idsSource,
		  checkType: "invert/notEmpty"
		}, React.createElement("div", {
		  className: "standard-row-padding"
		}, Wprr.idText("No results", "site.noResults")))))))), React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)))
		);
	}
}

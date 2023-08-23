import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SelectRelations extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
		this._elementTreeItem.setValue("search", "");
		
		let rangeLoader = this._elementTreeItem.addNode("rangeLoader", new Wprr.utils.data.nodes.LoadDataRange());
		
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		let statusSelection = this.getFirstInputWithDefault("statusSelection", "includePrivate");
		
		this._elementTreeItem.getLinks("items").input(rangeLoader.item.getLinks("items"));
		
		rangeLoader.setUrl(this.getWprrUrl("range/?select=" + statusSelection + ",byObjectType&encode=" + this._getEncodings() + "&type=" + objectType, "wprrData"));
		
		let filterItem = this._elementTreeItem.group.createInternalItem();
		let filteredList = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(filterItem);
		filterItem.getType("all").input(this._elementTreeItem.getLinks("items"));
		
		let searchFilterItem = filteredList.addFieldSearch("title.value,id");
		this._elementTreeItem.addSingleLink("searchFilter", searchFilterItem.id);
		searchFilterItem.getType("searchValue").input(this._elementTreeItem.getValueSource("search"));
		
		let sortItem = this._elementTreeItem.group.createInternalItem();
		let sort = Wprr.utils.data.multitypeitems.controllers.list.SortedList.create(sortItem);
		this._elementTreeItem.addSingleLink("sort", sortItem.id);
		
		let newSortItem = sort.addFieldSort("title.value", function(aValue) {return aValue});
		newSortItem.addType("element", React.createElement("div", {}, "By title"));
		newSortItem.setValue("buttonName", "title");
		
		sortItem.getLinks("all").input(filterItem.getLinks("filtered"));
		
		this._elementTreeItem.getLinks("sortedItems").input(sortItem.getType("sorted"));
	}
	
	_getEncodings() {
		return "postTitle,postStatus,objectTypes";
	}
	
	_createItem() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let itemId = itemEditor.editedItem.id;
		
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		let search = this._elementTreeItem.getValue("search");
		creator.setTitle(search);
		
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		creator.setDataType(objectType);
		
		let postStatus = this.getFirstInputWithDefault("newItemStatus", "draft");
		creator.changeData.setStatus(postStatus);
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "title", search));
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", postStatus));
		
		let relationEditor = this.getRelationEditor();
		creator.addCreatedCommand(Wprr.commands.callFunction(relationEditor, relationEditor.createRelation, [Wprr.sourceEvent("createdItem.id")]));
		
		creator.addCreatedCommand(Wprr.commands.callFunction(this._elementTreeItem.getLinks("creatingRows"), "removeItem", [creator.item.id]));
		this._elementTreeItem.getLinks("creatingRows").addItem(creator.item.id);
		
		creator.create();
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getEncodings() {
		return "postTitle,postStatus";
	}
	
	_renderMainElement() {
		//console.log("SelectRelations::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		let allowCreation = this.getFirstInputWithDefault("allowCreation", true);
		let encodings = this._getEncodings();
		
		return React.createElement("div", null,
		React.createElement(Wprr.AddReference, {
		  data: Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, objectType]),
		  as: "valueEditor"
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
		  className: "small-item-spacing flex-no-wrap",
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
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: this._elementTreeItem.getLinks("sortedItems").idsSource,
		  checkType: "notEmpty"
		}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
		  ids: this._elementTreeItem.getLinks("sortedItems").idsSource
		}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
		  commands: [Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "createRelation", [Wprr.sourceReference("item", "id")]), Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")]
		}, /*#__PURE__*/React.createElement("div", {
		  className: "hover-row cursor-pointer standard-row-padding"
		}, Wprr.text(Wprr.sourceReference("item", "title")))))), /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: this._elementTreeItem.getLinks("sortedItems").idsSource,
		  checkType: "invert/notEmpty"
		}, /*#__PURE__*/React.createElement("div", {
		  className: "standard-row-padding"
		}, Wprr.idText("No results", "site.noResults"))), /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: allowCreation
		}, /*#__PURE__*/React.createElement(Wprr.HasData, {
		  check: this._elementTreeItem.getValueSource("search"),
		  checkType: "notEmpty"
		}, /*#__PURE__*/React.createElement("div", {
		  className: "standard-row-padding"
		}, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
		  commands: [Wprr.commands.callFunction(this, this._createItem), Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")],
		  className: "standard-button standard-button-padding text-align-center"
		}, /*#__PURE__*/React.createElement(Wprr.TextWithReplacements, {
		  text: Wprr.sourceTranslation("Create \"{objectType}\"", "site.createObjectType"),
		  replacements: {
		    "{objectType}": this._elementTreeItem.getValueSource("search")
		  },
		  sourceUpdates: this._elementTreeItem.getValueSource("search")
		})))))))))), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)))
		);
	}
}

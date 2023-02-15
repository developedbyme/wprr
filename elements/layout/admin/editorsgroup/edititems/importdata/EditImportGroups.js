"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditImportGroups from "./EditImportGroups";
export default class EditImportGroups extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditImportGroups::constructor");
		
		super._construct();
		
		this._elementTreeItem.addSingleLink("operation", null);
		this._elementTreeItem.getLinks("selectedItems");
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
		
		let activeList = this._elementTreeItem.addNode("activeList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		activeList.item.setValue("activateWhenAdded", false);
		activeList.item.getLinks("items").input(this._elementTreeItem.getLinks("groups"));
		this._elementTreeItem.getLinks("rows").input(activeList.item.getLinks("rows"));
		this._elementTreeItem.getLinks("selectedItems").input(activeList.item.getLinks("activeItems"));
		
		this._elementTreeItem.getLinks("groups").idsSource.input(loader.item.getLinks("items").idsSource);
		loader.setUrl(this.getWprrUrl("range/?select=relation,anyStatus&encode=fields,relations&type=group/import-group", "wprrData"));
		
		let table = this._elementTreeItem.addNode("table", new Wprr.utils.data.multitypeitems.itemstable.ItemsTable());
		
		{
			let column = table.createColumn("select", "").setCellClasses("select-id-cell-width");
			column.setElement(React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing vertically-center-items"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  checked: Wprr.sourceReference("row", "active")
}), /*#__PURE__*/React.createElement("div", {
  className: "standard-flag standard-flag-padding id-flag"
}, Wprr.text(Wprr.sourceReference("item", "id"))))));
		}
		
		{
			let column = table.createColumn("name", "Name");
			column.setElement(React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["name"]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)));
		}
		
		
		{
			let column = table.createColumn("edit", "Edit").setCellClasses("short-cell-width");
			column.setElement(React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.Link, {
  href: Wprr.sourceCombine(Wprr.sourceReference("projectLinks", "wp/site/admin/import-groups/import-group/"), "?id=", Wprr.sourceReference("item", "id"))
}, Wprr.idText("Edit", "site.edit"))));
		}
		
		let batchEditItem = this._elementTreeItem.group.getItem("batchEdit/importGroups");
		
		{
			let noneItem = this._elementTreeItem.group.createInternalItem();
			noneItem.setValue("name", "None");
			noneItem.setValue("selectedLabel", "Select operation");
			batchEditItem.getLinks("batchActions").addItem(noneItem.id);
		}
		
		{
			let batchOpeartionItem = this._elementTreeItem.group.createInternalItem();
			batchOpeartionItem.setValue("name", "Clear cache");
			batchOpeartionItem.setValue("element", React.createElement(Wprr.layout.admin.batch.ClearCache));
			batchEditItem.getLinks("batchActions").addItem(batchOpeartionItem.id);
		}
		
		{
			let batchOpeartionItem = this._elementTreeItem.group.createInternalItem();
			batchOpeartionItem.setValue("name", "Api command");
			batchOpeartionItem.setValue("element", React.createElement(Wprr.layout.admin.batch.ApiCommand));
			batchEditItem.getLinks("batchActions").addItem(batchOpeartionItem.id);
		}
	}
	
	_add() {
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getCreateLoader("dbm_data", "group/import-group");
		
		loader.changeData.addTerm("named-item", "dbm_type", "slugPath");
		loader.changeData.setTitle("New import group");
		loader.changeData.setDataField("name", "New import group");
		loader.changeData.setStatus("private");
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._added, [Wprr.sourceEvent("data.id")]));
		
		loader.load();
	}
	
	_added(aId) {
		let loader = this._elementTreeItem.createNode("loader" + aId, "loadDataRange");
		loader.item.getLinks("items").idsSource.addChangeCommand(Wprr.commands.callFunction(this, this._initalDataLoaded, [aId]));
		loader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=fields,relations&ids=" + aId, "wprrData"));
	}
	
	_initalDataLoaded(aId) {
		this._elementTreeItem.getLinks("groups").addItem(aId);
	}
	
	_renderMainElement() {
		//console.log("EditCustomers::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: (this)._elementTreeItem,
  as: "editorItem"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: editorsGroup,
  as: "editorsGroup"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceStatic((this)._elementTreeItem, "table.linkedItem"),
  as: "table"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
  className: "no-margins"
}, Wprr.idText("Import items", "site.importItems")), /*#__PURE__*/React.createElement("div", {
  className: "operations"
}, /*#__PURE__*/React.createElement(Wprr.SelectItem, {
  id: "batchEdit/customers",
  as: "batchEdit"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing"
}, Wprr.DropdownSelection.createSelfContained(React.createElement(Wprr.layout.form.DropdownButton, {
  "className": "cursor-pointer batch-operations-text batch-operations-select-title",
  "text": Wprr.sourceFirst(Wprr.sourceReference("editorItem", "operation.linkedItem.selectedLabel"), Wprr.sourceReference("editorItem", "operation.linkedItem.name"), Wprr.sourceTranslation("Select operation", "site.admin.selectOperation")),
  "sourceUpdates": Wprr.sourceReference("editorItem", "operation.idSource")
}), /*#__PURE__*/React.createElement("div", {
  className: "custom-selection-container custom-selection-menu"
}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: Wprr.sourceReference("batchEdit", "batchActions.idsSource")
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.setProperty(Wprr.sourceReference("editorItem", "operation"), "id", Wprr.sourceReference("item", "id")), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]
}, /*#__PURE__*/React.createElement("div", {
  className: "hover-row standard-row standard-row-padding cursor-pointer"
}, Wprr.text(Wprr.sourceReference("item", "name")))))), {
  className: "absolute-container"
}), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceReference("editorItem", "selectedItems.idsSource"),
  checkType: "notEmpty"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing batch-operations-text"
}, /*#__PURE__*/React.createElement("div", null, "for"), /*#__PURE__*/React.createElement(Wprr.layout.ListWithOthers, {
  items: Wprr.sourceReference("editorItem", "selectedItems.items"),
  nameField: "fields.name.value",
  sourceUpdates: Wprr.sourceReference("editorItem", "selectedItems.idsSource"),
  showNumberOfItems: 2
})))))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.form.MoreOptionsDropdown, {
  className: "dropdown-from-right"
}, /*#__PURE__*/React.createElement("div", {
  className: "custom-selection-menu-padding"
}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: Wprr.sourceReference("table", "activeList.linkedItem.rows.idsSource")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "micro-item-spacing vertically-center-items"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  checked: Wprr.sourceReference("item", "active")
}), Wprr.text(Wprr.sourceReference("item", "forItem.linkedItem.name"))))))))), /*#__PURE__*/React.createElement("div", {
  className: "spacing medium"
}), /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
  id: "operation.linkedItem",
  from: Wprr.sourceReference("editorItem"),
  as: "batchActionItem",
  sourceUpdates: Wprr.sourceReference("editorItem", "operation.idSource")
}, /*#__PURE__*/React.createElement(Wprr.InsertElement, {
  element: Wprr.sourceReference("batchActionItem", "element"),
  canBeEmpty: true
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing medium"
}), /*#__PURE__*/React.createElement(Wprr.InsertElement, {
  element: Wprr.sourceReference("table", "headerRowElement")
}), /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: (this)._elementTreeItem.getLinks("rows").idsSource,
  as: "row"
}, /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
  id: "forItem.linkedItem",
  from: Wprr.sourceReference("row"),
  as: "item"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")]),
  as: "itemEditor"
}, /*#__PURE__*/React.createElement(Wprr.InsertElement, {
  element: Wprr.sourceReference("table", "rowElement")
}))), /*#__PURE__*/React.createElement("div", {
  className: "spacing medium",
  "data-slot": "spacing"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  text: Wprr.sourceTranslation("Add", "site.add"),
  commands: Wprr.commands.callFunction(this, (this)._add, []),
  className: "add-button add-button-padding cursor-pointer"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceReference("editorsGroup", "item.changed")
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  commands: Wprr.commands.callFunction(Wprr.sourceReference("editorsGroup"), "save")
}, /*#__PURE__*/React.createElement("div", null, "Save all changes")))), /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceReference("editorsGroup", "item.changed"),
  checkType: "invert/default"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "standard-button standard-button-padding inactive"
}, /*#__PURE__*/React.createElement("div", null, "No changes to save"))))))))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null))
	}
}
"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditImportGroup from "./EditImportGroup";
export default class EditImportGroup extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditImportGroup::constructor");
		
		super._construct();
		
		this._elementTreeItem.addSingleLink("operation", null);
		this._elementTreeItem.getLinks("selectedItems");
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
		
		let activeList = this._elementTreeItem.addNode("activeList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		activeList.item.setValue("activateWhenAdded", false);
		activeList.item.getLinks("items").input(this._elementTreeItem.getLinks("importItems"));
		this._elementTreeItem.getLinks("rows").input(activeList.item.getLinks("rows"));
		this._elementTreeItem.getLinks("selectedItems").input(activeList.item.getLinks("activeItems"));
		
		loader.setUrl(this.getWprrUrl("range/?select=relation,anyStatus,objectRelation&encode=id&type=import-item&path=in:in:import-item&fromIds=" + itemId, "wprrData"));
		
		let detailsLoader = this._elementTreeItem.addNode("detailsLoader", new Wprr.utils.data.nodes.LoadAdditionalItems());
		detailsLoader.item.setValue("url", this.getWprrUrl("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,fields,relations,objectTypes&ids={ids}", "wprrData"));
		detailsLoader.item.getLinks("ids").input(loader.item.getLinks("items"));
		
		this._elementTreeItem.getLinks("importItems").input(detailsLoader.item.getLinks("loadedIds"));
		
		
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
			let column = table.createColumn("identifier", "Identifier");
			column.setElement(React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["identifier"]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)));
		}
		
		{
			let column = table.createColumn("importType", "Import type");
			column.setElement(React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectType, {
  direction: "incoming",
  relationType: "for",
  objectType: "type/import-type"
}));
		}
		
		{
			let column = table.createColumn("value", "Value");
			column.setElement(React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["value"]),
  as: "valueEditor"
}, /*#__PURE__*/React.createElement(Wprr.JsonEditor, {
  className: "standard-field standard-field-padding full-width",
  value: Wprr.sourceReference("valueEditor", "valueSource")
}), /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)));
		}
		
		{
			let column = table.createColumn("importedItem", "Imported item");
			column.setElement(React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectAnyRelation, {
  direction: "outgoing",
  relationType: "for"
}));
		}
		
		{
			let column = table.createColumn("runImport", "Run import");
			column.setElement(React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, (this)._runImport, [Wprr.sourceReference("item", "id")])
}, /*#__PURE__*/React.createElement("div", {
  className: "edit-button "
}, "Run import"))));
		}
		
		let batchEditItem = this._elementTreeItem.group.getItem("batchEdit/importGroup");
		
		{
			let noneItem = this._elementTreeItem.group.createInternalItem();
			noneItem.setValue("name", "None");
			noneItem.setValue("selectedLabel", "Select operation");
			batchEditItem.getLinks("batchActions").addItem(noneItem.id);
		}
		
		{
			let item = this._elementTreeItem.group.createInternalItem();
			item.setValue("name", "Run imports");
			item.setValue("selectedLabel", "Run imports");
			item.setValue("element", React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  commands: Wprr.commands.callFunction(this, (this)._runBatchImports),
  text: "Run imports"
}), /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
  commands: Wprr.commands.callFunction(this, (this)._runAllBatchImports),
  text: "Run all imports"
})));
			batchEditItem.getLinks("batchActions").addItem(item.id);
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
		
		let processItem = this._elementTreeItem.group.createInternalItem();
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		let loader = project.getCreateLoader("dbm_data", "import-item", "draft", "Import item in " + itemId);
		loader.changeData.addTerm("identifiable-item", "dbm_type", "slugPath");
		loader.changeData.addTerm("value-item", "dbm_type", "slugPath");
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._added, [Wprr.sourceEvent("data.id"), processItem]));
		
		loader.load();
		
		processItem.requireValue("loaded", false);
		processItem.addNode("createLoader", loader);
		
		return processItem;
	}
	
	_added(aId, aProcessItem) {
		console.log("_initalDataLoaded");
		
		let loader = this._elementTreeItem.createNode("loader" + aId, "loadDataRange");
		loader.item.getLinks("items").idsSource.addChangeCommand(Wprr.commands.callFunction(this, this._initalDataLoaded, [aId, aProcessItem]));
		loader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=fields,relations,postStatus,objectTypes&ids=" + aId, "wprrData"));
		
		aProcessItem.addSingleLink("initialLoader", loader.item.id);
		aProcessItem.addSingleLink("createdItem", aId);
	}
	
	_initalDataLoaded(aId, aProcessItem) {
		console.log("_initalDataLoaded");
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		let links = this._elementTreeItem.getLinks("importItems");
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		let itemEditor = editorsGroup.getItemEditor(aId);
		let postStatusEditor = itemEditor.getPostStatusEditor();
		
		postStatusEditor.item.setValue("value", "private");
		
		let groupItemEditor = editorsGroup.getItemEditor(itemId);
		{
			let editor = groupItemEditor.getRelationEditor("incoming", "in", "import-item").multipleEditor;
			editor.item.getLinks("activeItems").addItem(aId);
		}
		
		links.addItem(aId);
		
		aProcessItem.setValue("loaded", true);
	}
	
	_runImport(aId) {
		console.log("_runImport");
		console.log(aId);
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getPerformActionLoader("importItem", [aId]);
		
		loader.load();
	}
	
	_runBatchImports() {
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		let loadingSequence = Wprr.utils.loading.LoadingSequence.create();
		
		let ids = this._elementTreeItem.getLinks("selectedItems").ids;
		
		let currentArray = ids;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let loader = project.getPerformActionLoader("importItem", [currentArray[i]]);
			loadingSequence.addLoader(loader);
		}
		
		loadingSequence.load();
	}
	
	_runAllBatchImports() {
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		let loadingSequence = Wprr.utils.loading.LoadingSequence.create();
		
		let ids = this._elementTreeItem.getLinks("importItems").ids;
		
		let currentArray = ids;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let loader = project.getPerformActionLoader("importItem", [currentArray[i]]);
			loadingSequence.addLoader(loader);
		}
		
		loadingSequence.load();
	}
	
	_selectAll() {
		this._elementTreeItem.getLinks("selectedItems").setItems([].concat(this._elementTreeItem.getLinks("importItems").ids));
	}
	
	_selectVisible() {
		this._elementTreeItem.getLinks("selectedItems").setItems([].concat(this._elementTreeItem.getLinks("importItems").ids));
	}
	
	_selectNone() {
		this._elementTreeItem.getLinks("selectedItems").setItems([]);
	}
	
	_renderMainElement() {
		//console.log("EditImportGroup::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: (this)._elementTreeItem,
  as: "editorItem"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: editorsGroup,
  as: "editorsGroup"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceStatic((this)._elementTreeItem, "table.linkedItem"),
  as: "table"
}, /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations&ids=", itemId),
  as: "itemLoader"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [itemId]),
  as: "customerItemEditor"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
  className: "no-margins"
}, Wprr.idText("Import items", "site.importItems")), /*#__PURE__*/React.createElement("div", {
  className: "operations"
}, /*#__PURE__*/React.createElement(Wprr.SelectItem, {
  id: "batchEdit/importGroup",
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
}, React.createElement(Wprr.CommandButton, {
  "commands": Wprr.commands.callFunction(this, (this)._selectAll)
}, React.createElement("div", {
  "className": "action-link cursor-pointer hover-row"
}, Wprr.idText("Select all", "site.admin.selectAll"))), React.createElement(Wprr.CommandButton, {
  "commands": Wprr.commands.callFunction(this, (this)._selectVisible)
}, React.createElement("div", {
  "className": "action-link cursor-pointer hover-row"
}, Wprr.idText("Select visible", "site.admin.selectVisible"))), React.createElement(Wprr.CommandButton, {
  "commands": Wprr.commands.callFunction(this, (this)._selectNone)
}, React.createElement("div", {
  "className": "action-link cursor-pointer hover-row"
}, Wprr.idText("Select none", "site.admin.selectNone"))), /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
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
}, /*#__PURE__*/React.createElement(Wprr.ScrollActivatedItem, null, /*#__PURE__*/React.createElement(Wprr.RelatedItem, {
  id: "forItem.linkedItem",
  from: Wprr.sourceReference("row"),
  as: "item"
}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
  data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")]),
  as: "itemEditor"
}, /*#__PURE__*/React.createElement(Wprr.InsertElement, {
  element: Wprr.sourceReference("table", "rowElement")
})))), /*#__PURE__*/React.createElement("div", {
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
}, /*#__PURE__*/React.createElement("div", null, "No changes to save"))))))))))));
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
}, /*#__PURE__*/React.createElement("div", null));
	}
}
"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditGlobalItems from "./EditGlobalItems";
export default class EditGlobalItems extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditGlobalItems::constructor");
		
		super._construct();
		
		this._elementTreeItem.addSingleLink("operation", null);
		this._elementTreeItem.getLinks("selectedItems");
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		
		let activeList = this._elementTreeItem.addNode("activeList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		activeList.item.setValue("activateWhenAdded", false);
		activeList.item.getLinks("items").input(this._elementTreeItem.getLinks("groups"));
		this._elementTreeItem.getLinks("rows").input(activeList.item.getLinks("rows"));
		this._elementTreeItem.getLinks("selectedItems").input(activeList.item.getLinks("activeItems"));
		
		this._elementTreeItem.getLinks("groups").idsSource.input(loader.item.getLinks("items").idsSource);
		loader.setUrl(this.getWprrUrl("range/?select=relation,includePrivate,includeDraft&encode=fields,relations&type=global-item", "wprrData"));
		
		let table = this._elementTreeItem.addNode("table", new Wprr.utils.data.multitypeitems.itemstable.ItemsTable());
		
		{
			let column = table.createColumn("select", "").setCellClasses("select-id-cell-width");
			column.setElement(React.createElement("div", null,
				React.createElement(Wprr.FlexRow, {className: "micro-item-spacing vertically-center-items"},
					React.createElement(Wprr.Checkbox, {checked: Wprr.sourceReference("row", "active")}),
					React.createElement("div", {className: "standard-flag standard-flag-padding id-flag"},
						Wprr.text(Wprr.sourceReference("item", "id"))
					)
				)
			));
		}
		
		{
			let column = table.createColumn("identifier", "Identifier");
			column.setElement(React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["identifier"]), as: "valueEditor"},
				React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
				React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
			));
		}
		
		{
			let column = table.createColumn("pointingTo", "Pointing to");
			column.setElement(React.createElement("div", null,
				React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectAnyRelation, {direction: "outgoing", relationType: "pointing-to"})
			));
		}
		
		let batchEditItem = this._elementTreeItem.group.getItem("batchEdit/globalItems");
		
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
		
		let loader = project.getCreateLoader("dbm_data", "global-item");
		
		loader.changeData.addTerm("identifiable-item", "dbm_type", "slugPath");
		loader.changeData.setTitle("New global item");
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
		//console.log("EditGlobalItems::_renderMainElement");
		
		return React.createElement("div", null,
			React.createElement(Wprr.AddReference, {data: this._elementTreeItem, as: "editorItem"},
				React.createElement(Wprr.layout.admin.editorsgroup.editors.EditorsGroup, {},
					React.createElement(Wprr.layout.admin.editorsgroup.SaveAllGroup, {},
						React.createElement(Wprr.AddReference, {data: Wprr.sourceStatic(this._elementTreeItem, "table.linkedItem"), as: "table"},
							React.createElement(Wprr.FlexRow, {className: "justify-between"},
								React.createElement("div", null,
									React.createElement("h2", {className: "no-margins"},
										Wprr.idText("Global items", "site.globalItems")
									),
									React.createElement("div", {className: "operations"},
										React.createElement(Wprr.SelectItem, {id: "batchEdit/globalItems", as: "batchEdit"},
											React.createElement("div", null,
												React.createElement(Wprr.FlexRow, {className: "micro-item-spacing"},
													Wprr.DropdownSelection.createSelfContained(
														React.createElement(Wprr.layout.form.DropdownButton, {"className": "cursor-pointer batch-operations-text batch-operations-select-title", "text": Wprr.sourceFirst(Wprr.sourceReference("editorItem", "operation.linkedItem.selectedLabel"), Wprr.sourceReference("editorItem", "operation.linkedItem.name"), Wprr.sourceTranslation("Select operation", "site.admin.selectOperation")), "sourceUpdates": Wprr.sourceReference("editorItem", "operation.idSource")}),
														React.createElement("div", {className: "custom-selection-container custom-selection-menu"},
															React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceReference("batchEdit", "batchActions.idsSource")},
																React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.setProperty(Wprr.sourceReference("editorItem", "operation"), "id", Wprr.sourceReference("item", "id")), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]},
																	React.createElement("div", {className: "hover-row standard-row standard-row-padding cursor-pointer"},
																		Wprr.text(Wprr.sourceReference("item", "name"))
																	)
																)
															)
														),
														{className: "absolute-container"}
													),
													React.createElement(Wprr.HasData, {check: Wprr.sourceReference("editorItem", "selectedItems.idsSource"),checkType: "notEmpty"},
														React.createElement(Wprr.FlexRow, {className: "micro-item-spacing batch-operations-text"}, React.createElement("div", null, "for"),
															React.createElement(Wprr.layout.ListWithOthers, {items: Wprr.sourceReference("editorItem", "selectedItems.items"), nameField: "fields.name.value", sourceUpdates: Wprr.sourceReference("editorItem", "selectedItems.idsSource"), showNumberOfItems: 2})
														)
													)
												)
											)
										)
									)
								),
								React.createElement("div", null,
									React.createElement(Wprr.layout.form.MoreOptionsDropdown, {className: "dropdown-from-right"},
										React.createElement("div", {className: "custom-selection-menu-padding"},
											React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceReference("table", "activeList.linkedItem.rows.idsSource")},
												React.createElement("div", null, 
													React.createElement(Wprr.FlexRow, {className: "micro-item-spacing vertically-center-items"},
														React.createElement(Wprr.Checkbox, {checked: Wprr.sourceReference("item", "active")}),
														Wprr.text(Wprr.sourceReference("item", "forItem.linkedItem.name"))
													)
												)
											)
										)
									)
								)
							),
							React.createElement("div", {className: "spacing medium"}),
							React.createElement(Wprr.RelatedItem, {id: "operation.linkedItem", from: Wprr.sourceReference("editorItem"), as: "batchActionItem", sourceUpdates: Wprr.sourceReference("editorItem", "operation.idSource")},
								React.createElement(Wprr.InsertElement, {element: Wprr.sourceReference("batchActionItem", "element"), canBeEmpty: true})
							),
							React.createElement("div", {className: "spacing medium"}),
							React.createElement(Wprr.InsertElement, {element: Wprr.sourceReference("table", "headerRowElement")}),
							React.createElement(Wprr.layout.ItemList, {ids: this._elementTreeItem.getLinks("rows").idsSource, as: "row"},
								React.createElement(Wprr.RelatedItem, {id: "forItem.linkedItem", from: Wprr.sourceReference("row"), as: "item"},
									React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("editorsGroup", Wprr.sourceCombine("itemEditor.", Wprr.sourceReference("item", "id"))), as: "itemEditor"},
										React.createElement(Wprr.InsertElement, {element: Wprr.sourceReference("table", "rowElement")})
									)
								),
								React.createElement("div", {className: "spacing medium", "data-slot": "spacing"})
							),
							React.createElement("div", {className: "spacing standard"}),
							React.createElement(Wprr.FlexRow, null,
								React.createElement(Wprr.layout.interaction.Button, {text: Wprr.sourceTranslation("Add", "site.add"), commands: Wprr.commands.callFunction(this, this._add, []), className: "add-button add-button-padding cursor-pointer"})
							)
						)
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null)
		);
	}
}
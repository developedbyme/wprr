"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditContentTemplates from "./EditContentTemplates";
export default class EditContentTemplates extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditContentTemplates::constructor");
		
		super._construct();
		
		this._elementTreeItem.addSingleLink("operation", null);
		this._elementTreeItem.getLinks("selectedItems");
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
		
		let activeList = this._elementTreeItem.addNode("activeList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		activeList.item.setValue("activateWhenAdded", false);
		activeList.item.getLinks("items").input(this._elementTreeItem.getLinks("items"));
		this._elementTreeItem.getLinks("rows").input(activeList.item.getLinks("rows"));
		this._elementTreeItem.getLinks("selectedItems").input(activeList.item.getLinks("activeItems"));
		
		this._elementTreeItem.getLinks("items").idsSource.input(loader.item.getLinks("items").idsSource);
		loader.setUrl(this.getWprrUrl("range/?select=relation,anyStatus&encode=postTitle&type=content-template", "wprrData"));
		
		let table = this._elementTreeItem.addNode("table", new Wprr.utils.data.multitypeitems.itemstable.ItemsTable());
		
		{
			let column = table.createColumn("select", "").setCellClasses("select-id-cell-width");
			column.setElement(<div>
				<Wprr.FlexRow className="micro-item-spacing vertically-center-items">
					<Wprr.Checkbox checked={Wprr.sourceReference("row", "active")} />
					<div className="standard-flag standard-flag-padding id-flag">{Wprr.text(Wprr.sourceReference("item", "id"))}</div>
				</Wprr.FlexRow>
			</div>);
		}
		
		{
			let column = table.createColumn("name", "Name");
			column.setElement(<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["name"])} as="valueEditor">
				<Wprr.FormField className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
				<Wprr.layout.admin.editorsgroup.SaveValueChanges />
			</Wprr.AddReference>);
		}
		
		{
			let column = table.createColumn("edit", "Edit").setCellClasses("short-link-cell-width");
			column.setElement(<div>
				<Wprr.Link href={Wprr.sourceCombine(Wprr.sourceReference("projectLinks", "wp/site/admin/content-templates/content-template/?id="), Wprr.sourceReference("item", "id"))}>
					{Wprr.idText("Edit", "site.edit")}
				</Wprr.Link>
			</div>);
		}
		
		{
			let column = table.createColumn("title", "Title");
			column.setElement(<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["title"])} as="valueEditor">
				<Wprr.FormField className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
				<Wprr.layout.admin.editorsgroup.SaveValueChanges />
			</Wprr.AddReference>);
			column.deactivate();
		}
		
		{
			let column = table.createColumn("content", "Content");
			column.setElement(<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["content"])} as="valueEditor">
				<Wprr.RichTextEditor className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
				<Wprr.layout.admin.editorsgroup.SaveValueChanges />
			</Wprr.AddReference>);
			column.deactivate();
		}
		
		let batchEditItem = this._elementTreeItem.group.getItem("batchEdit/contentTemplates");
		
		{
			let noneItem = this._elementTreeItem.group.createInternalItem();
			noneItem.setValue("name", "None");
			noneItem.setValue("selectedLabel", "Select operation");
			batchEditItem.getLinks("batchActions").addItem(noneItem.id);
		}
		
		{
			let batchOpeartionItem = this._elementTreeItem.group.createInternalItem();
			batchOpeartionItem.setValue("name", "Clear cache");
			batchOpeartionItem.setValue("element", <Wprr.layout.admin.batch.ClearCache />);
			batchEditItem.getLinks("batchActions").addItem(batchOpeartionItem.id);
		}
		
		{
			let batchOpeartionItem = this._elementTreeItem.group.createInternalItem();
			batchOpeartionItem.setValue("name", "Api command");
			batchOpeartionItem.setValue("element", <Wprr.layout.admin.batch.ApiCommand />);
			batchEditItem.getLinks("batchActions").addItem(batchOpeartionItem.id);
		}
	}
	
	_add() {
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getCreateLoader("dbm_data", "content-template");
		
		//loader.changeData.addTerm("name-item", "dbm_type", "slugPath");
		loader.changeData.setTitle("New content template");
		loader.changeData.setDataField("name", "New content template");
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
		this._elementTreeItem.getLinks("items").addItem(aId);
	}
	
	_renderMainElement() {
		//console.log("EditContentTemplates::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		return <div>
		<Wprr.AddReference data={this._elementTreeItem} as="editorItem">
			<Wprr.AddReference data={editorsGroup} as="editorsGroup">
				<Wprr.AddReference data={Wprr.sourceStatic(this._elementTreeItem, "table.linkedItem")} as="table">
					<Wprr.FlexRow className="justify-between">
<div>
	<h2 className="no-margins">{Wprr.idText("Content templates", "site.contentTemplates")}</h2>
	<div className="operations">
		<Wprr.SelectItem id="batchEdit/contentTemplates" as="batchEdit">
			<div>
				<Wprr.FlexRow className="micro-item-spacing">
					{Wprr.DropdownSelection.createSelfContained(
						React.createElement(Wprr.layout.form.DropdownButton, {
							"className": "cursor-pointer batch-operations-text batch-operations-select-title",
							"text": Wprr.sourceFirst(
								Wprr.sourceReference("editorItem", "operation.linkedItem.selectedLabel"),
								Wprr.sourceReference("editorItem", "operation.linkedItem.name"),
								Wprr.sourceTranslation("Select operation", "site.admin.selectOperation")
							),
							"sourceUpdates": Wprr.sourceReference("editorItem", "operation.idSource")
						}),
						<div className="custom-selection-container custom-selection-menu">
							<Wprr.layout.ItemList ids={Wprr.sourceReference("batchEdit", "batchActions.idsSource")}>
								<Wprr.CommandButton commands={[
									Wprr.commands.setProperty(Wprr.sourceReference("editorItem", "operation"), "id", Wprr.sourceReference("item", "id")),
									Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)
								]}>
									<div className="hover-row standard-row standard-row-padding cursor-pointer">{Wprr.text(Wprr.sourceReference("item", "name"))}</div>
								</Wprr.CommandButton>
							</Wprr.layout.ItemList>
						</div>,
						{ className: "absolute-container" }
					)}
					<Wprr.HasData check={Wprr.sourceReference("editorItem", "selectedItems.idsSource")} checkType="notEmpty">
						<Wprr.FlexRow className="micro-item-spacing batch-operations-text">
							<div>for</div>
							<Wprr.layout.ListWithOthers items={Wprr.sourceReference("editorItem", "selectedItems.items")} nameField="fields.name.value" sourceUpdates={Wprr.sourceReference("editorItem", "selectedItems.idsSource")} showNumberOfItems={2} />
						</Wprr.FlexRow>
					</Wprr.HasData>
				</Wprr.FlexRow>
			</div>
		</Wprr.SelectItem>
	</div>
</div>
						<div>
							<Wprr.layout.form.MoreOptionsDropdown className="dropdown-from-right">
								<div className="custom-selection-menu-padding">
									<Wprr.layout.ItemList ids={Wprr.sourceReference("table", "activeList.linkedItem.rows.idsSource")}>
										<div>
											<Wprr.FlexRow className="micro-item-spacing vertically-center-items">
												<Wprr.Checkbox checked={Wprr.sourceReference("item", "active")} />
												{Wprr.text(Wprr.sourceReference("item", "forItem.linkedItem.name"))}
											</Wprr.FlexRow>
										</div>
									</Wprr.layout.ItemList>
								</div>
							</Wprr.layout.form.MoreOptionsDropdown>
						</div>
					</Wprr.FlexRow>
					<div className="spacing medium" />
					<Wprr.RelatedItem id="operation.linkedItem" from={Wprr.sourceReference("editorItem")} as="batchActionItem" sourceUpdates={Wprr.sourceReference("editorItem", "operation.idSource")}>
						<Wprr.InsertElement element={Wprr.sourceReference("batchActionItem", "element")} canBeEmpty={true} />
					</Wprr.RelatedItem>
					<div className="spacing medium" />
					<Wprr.InsertElement element={Wprr.sourceReference("table", "headerRowElement")} />
					<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("rows").idsSource} as="row">
						<Wprr.RelatedItem id="forItem.linkedItem" from={Wprr.sourceReference("row")} as="item">
							<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations,postTerms&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
								<Wprr.AddReference data={Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")])} as="itemEditor">
									<Wprr.InsertElement element={Wprr.sourceReference("table", "rowElement")} />
								</Wprr.AddReference>
							</Wprr.layout.loader.DataRangeLoader>
						</Wprr.RelatedItem>
						<div className="spacing medium" data-slot="spacing" />
					</Wprr.layout.ItemList>
					<div className="spacing standard" />
					<Wprr.FlexRow className="justify-between">
						<Wprr.FlexRow>
							<Wprr.layout.interaction.Button text={Wprr.sourceTranslation("Add", "site.add")} commands={Wprr.commands.callFunction(this, this._add, [])} className="add-button add-button-padding cursor-pointer" />
						</Wprr.FlexRow>
						<div>
							<Wprr.HasData check={Wprr.sourceReference("editorsGroup", "item.changed")}>
								<div>
									<Wprr.layout.interaction.Button commands={Wprr.commands.callFunction(Wprr.sourceReference("editorsGroup"), "save")}>
										<div>Save all changes</div>
									</Wprr.layout.interaction.Button>
								</div>
							</Wprr.HasData>
							<Wprr.HasData check={Wprr.sourceReference("editorsGroup", "item.changed")} checkType="invert/default">
								<div>
									<div className="standard-button standard-button-padding inactive">
										<div>No changes to save</div>
									</div>
								</div>
							</Wprr.HasData>
						</div>
					</Wprr.FlexRow>
				</Wprr.AddReference>
			</Wprr.AddReference>
			</Wprr.AddReference>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div>
				
			</div>
		</Wprr.layout.admin.WpBlockEditor>
	}
}
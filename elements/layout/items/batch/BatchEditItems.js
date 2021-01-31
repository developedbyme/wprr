"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

import Operations from "./Operations";

// import BatchEditItems from "./BatchEditItems";
export default class BatchEditItems extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("BatchEditItems::constructor");

		super();
		
		this._layoutName = "batchEditItems";
		
		this._itemsEditor = new Wprr.wp.admin.ItemsEditor();
		this._itemsTable = new Wprr.utils.data.multitypeitems.itemstable.ItemsTable();
		this._itemsEditor.items.getItem("table").addType("table", this._itemsTable);
		
		this._loadData = {};
	}
	
	get itemsEditor() {
		return this._itemsEditor;
	}
	
	_prepareInitialRender() {
		//console.log("BatchEditItems::_prepareInitialRender");
		
		this._itemsTable.createRowElement();
		
		super._prepareInitialRender();
		
		let projectName = this.getFirstInput("projectName", Wprr.sourceReference("wprr/projectName"));
		let dataTypes = [].concat(Wprr.utils.array.arrayOrSeparatedString(this.getFirstInput("dataType")));
		let dataType = dataTypes.shift();
		
		this._itemsEditor.relateToProject(projectName);
		this._itemsEditor.setupCreation(dataType, null, this.getFirstInput("creationMethod"));
		
		if(dataTypes.length > 0) {
			this._itemsEditor.addChangeData.setTerms(dataTypes, "dbm_type", "slugPath", "addTerms");
		}
		
		let postType = this.getFirstInput("postType");
		if(postType) {
			this._itemsEditor._dataType = postType;
		}
		
		
		this._itemsEditor.setSearchFields(this.getFirstInputWithDefault("searchFields", "fieldByName.name.field.value"));
		
		let fields = this.getFirstInput("fields");
		
		let normalizedFields = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(fields);
		let fieldIds = Wprr.utils.array.mapField(normalizedFields, "key");
		
		this._itemsEditor.editStorage.updateValue("fields", fieldIds);
		this._itemsEditor.editStorage.updateValue("activeFields", fieldIds);
		
		let itemData = this.getFirstInputWithDefault("items", Wprr.sourceReference("items"), []);
		
		let cellTypes = this.getSource("cellTypes").value;
		
		if(normalizedFields) {
			let currentArray = normalizedFields;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentData = currentArray[i];
				let column = this._itemsTable.createColumn(currentData["key"], currentData["value"]["type"], currentData["value"]);
				column.createElement(cellTypes);
			}
		}
		
		this._itemsEditor.setupFromData(itemData);
		this._itemsEditor.start();
	}
	
	_addNames(aData) {
		//console.log("_addNames");
		//console.log(aData);
		
		let namesToLoad = this.getFirstInput("namesToLoad");
		if(namesToLoad) {
			let currentArray = Wprr.utils.array.arrayOrSeparatedString(namesToLoad);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				this._itemsEditor.addNames(aData[currentName], "dbmTypeRange_" + currentName);
			}
		}
	}
	
	_addTerms(aData) {
		let taxonomiesToLoad = this.getFirstInput("taxonomiesToLoad");
		if(taxonomiesToLoad) {
			let currentArray = Wprr.utils.array.arrayOrSeparatedString(taxonomiesToLoad);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				this._itemsEditor.items.addTerms(aData[currentName], currentName);
			}
		}
	}
	
	_getLayout(aSlots) {
		
		let fields = this.getFirstInput("fields");
		aSlots.prop("cellTypes", Wprr.layout.list.cells.areas)
		
		let namesToLoad = this.getFirstInput("namesToLoad");
		if(namesToLoad) {
			let currentArray = Wprr.utils.array.arrayOrSeparatedString(namesToLoad);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				this._loadData[currentName] = "wprr/v1/range/dbm_data/drafts,privates,relation/status,privateTitle?type=" + currentName;
			}
		}
		
		let taxonomiesToLoad = this.getFirstInput("taxonomiesToLoad");
		if(taxonomiesToLoad) {
			let currentArray = Wprr.utils.array.arrayOrSeparatedString(taxonomiesToLoad);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				this._loadData[currentName] = "wprr/v1/taxonomy/" + currentName + "/terms";
			}
		}
		
		let operationSection = aSlots.prop("operationSections", null);
		let operationOptions = aSlots.prop("operationOptions", null);
		
		let rowElement = this._itemsTable.item.getType("rowElement");
		
		return React.createElement("div", {className: "centered-block-for-overflow"},
			React.createElement(Wprr.FlexRow, null,
				React.createElement(Wprr.ReferenceInjection, {injectData: {"items": this._itemsEditor.items, "itemsEditor": this._itemsEditor, "fields": fields, "table": this._itemsTable}},
					React.createElement(Wprr.ExternalStorageInjection, {initialExternalStorage: this._itemsEditor.editStorage},
						React.createElement(Wprr.layout.items.batch.BatchEditHeader, {title: aSlots.prop("title", Wprr.sourceTranslation("Edit items", "site.admin.editItems"))},
							React.createElement(Wprr.HasData, {"data-slot": "operations", "check": operationSection},
								React.createElement(Operations, {"sections": operationSection, "operationOptions": operationOptions})
							),
							React.createElement("div", {"data-slot": "additionalMoreOptions"}, aSlots.slot("additionalMoreOptions", React.createElement("div"))),
						),
						React.createElement("div", {className: "spacing standard"}),
						React.createElement(Wprr.DataLoader, {loadData: this._loadData, loadedCommands: [
							Wprr.commands.callFunction(this, this._addNames, [Wprr.source("event", "raw")]),
							Wprr.commands.callFunction(this, this._addTerms, [Wprr.source("event", "raw")])
						]},
							React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceReference("externalStorage", "filteredIds"), className: "item-list"},
								/*React.createElement(Wprr.layout.items.batch.FieldsListItem, {cellTypes: aSlots.prop("cellTypes", Wprr.layout.list.cells.areas)}),*/
								rowElement
							),
						),
						React.createElement("div", {className: "spacing standard"}),
						React.createElement(Wprr.layout.items.batch.BatchEditFooter, null)
					)
				)
			)
		)
	}
}
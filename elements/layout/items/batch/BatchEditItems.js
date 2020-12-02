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
		
		this._loadData = {};
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let projectName = this.getFirstInput("projectName", Wprr.sourceReference("wprr/projectName"));
		let dataType = this.getFirstInput("dataType");
		
		this._itemsEditor.relateToProject(projectName);
		this._itemsEditor.setupCreation(dataType, null, this.getFirstInput("creationMethod"));
		
		let postType = this.getFirstInput("postType");
		if(postType) {
			this._itemsEditor._dataType = postType;
		}
		
		
		this._itemsEditor.setSearchFields(this.getFirstInputWithDefault("searchFields", "fieldByName.text.field.value"));
		
		let fields = this.getFirstInput("fields");
		
		let normalizedFields = Wprr.utils.KeyValueGenerator.normalizeArrayOrObject(fields);
		let fieldIds = Wprr.utils.array.mapField(normalizedFields, "key");
		
		this._itemsEditor.editStorage.updateValue("fields", fieldIds);
		this._itemsEditor.editStorage.updateValue("activeFields", fieldIds);
		
		let itemData = this.getFirstInputWithDefault("items", Wprr.sourceReference("items"), []);
		
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
		
		return React.createElement("div", {className: "centered-block-for-overflow"},
			React.createElement(Wprr.FlexRow, null,
				React.createElement(Wprr.ReferenceInjection, {injectData: {"items": this._itemsEditor.items, "itemsEditor": this._itemsEditor, "fields": fields}},
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
								React.createElement(Wprr.layout.items.batch.FieldsListItem, {cellTypes: aSlots.prop("cellTypes", Wprr.layout.list.cells.areas)})
							)
						),
						React.createElement("div", {className: "spacing standard"}),
						React.createElement(Wprr.layout.items.batch.BatchEditFooter, null)
					)
				)
			)
		)
	}
}
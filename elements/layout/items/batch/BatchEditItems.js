"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

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
		console.log(">>>>>", projectName, dataType);
		
		this._itemsEditor.relateToProject(projectName);
		this._itemsEditor.setupCreation(dataType);
		
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
		console.log("_addNames");
		console.log(aData);
		
		let namesToLoad = this.getFirstInput("namesToLoad");
		if(namesToLoad) {
			let currentArray = Wprr.utils.array.arrayOrSeparatedString(namesToLoad);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentName = currentArray[i];
				console.log(">", currentName, aData[currentName]);
				this._itemsEditor.addNames(aData[currentName]);
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
		
		//METODO: add terms to load
		
		//METODO: set operations
		
		return /*#__PURE__*/ React.createElement("div", {
  className: "centered-block-for-overflow"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, null, /*#__PURE__*/React.createElement(Wprr.ReferenceInjection, {
  injectData: {
    "items": this._itemsEditor.items,
    "itemsEditor": this._itemsEditor,
    "fields": fields
  }
}, /*#__PURE__*/React.createElement(Wprr.ExternalStorageInjection, {
  initialExternalStorage: this._itemsEditor.editStorage
}, /*#__PURE__*/React.createElement(Wprr.layout.items.batch.BatchEditHeader, {
  title: aSlots.prop("title", Wprr.sourceTranslation("Edit items"))
}, /*#__PURE__*/React.createElement("div", {
  "data-slot": "operations"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.DataLoader, {
  loadData: this._loadData,
  loadedCommands: Wprr.commands.callFunction(this, this._addNames, [Wprr.source("event", "raw")])
}, /*#__PURE__*/React.createElement(Wprr.EditableProps, {
  editableProps: "filteredIds",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.layout.ItemList, {
  ids: Wprr.sourceProp("filteredIds"),
  className: "item-list"
}, /*#__PURE__*/React.createElement(Wprr.layout.items.batch.FieldsListItem, {
  cellTypes: aSlots.prop("cellTypes", {})
})))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.layout.items.batch.BatchEditFooter, null)))));;
	}
}
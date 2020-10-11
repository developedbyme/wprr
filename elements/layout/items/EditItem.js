"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import EditItem from "./EditItem";
export default class EditItem extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("EditItem::constructor");

		super();
		
		this._layoutName = "editItem";
		
		this._itemsEditor = new Wprr.wp.admin.ItemsEditor();
		
		this._loadData = {};
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let projectName = this.getFirstInput("projectName", Wprr.sourceReference("wprr/projectName"));
		let dataType = this.getFirstInput("dataType");
		
		this._itemsEditor.relateToProject(projectName);
		this._itemsEditor.setupCreation(dataType);
		
		let item = this.getFirstInput("item", Wprr.sourceReference("item"));
		
		this._itemsEditor.addItemData(item);
		
		let additionalItems = this.getFirstInputWithDefault("additionalItems", Wprr.sourceStatic(item, "additionalItems"), []);
		this._itemsEditor.addItems(additionalItems);
		
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
				this._itemsEditor.addNames(aData[currentName]);
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
		
		let item = this.getFirstInput("item", Wprr.sourceReference("item"));
		
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
		
		return React.createElement(Wprr.ReferenceInjection, {injectData: {"items": this._itemsEditor.items, "itemsEditor": this._itemsEditor}},
			React.createElement(Wprr.ExternalStorageInjection, {initialExternalStorage: this._itemsEditor.editStorage},
				React.createElement(Wprr.DataLoader, {loadData: this._loadData, loadedCommands: [
					Wprr.commands.callFunction(this, this._addNames, [Wprr.source("event", "raw")]),
					Wprr.commands.callFunction(this, this._addTerms, [Wprr.source("event", "raw")])
				]},
					React.createElement(Wprr.SelectItem, {id: item["id"]},
						aSlots.default(React.createElement("div", {}, "No element set"))
					)
				),
				React.createElement("div", {className: "spacing standard"}),
				aSlots.slot("saveButton", React.createElement(Wprr.layout.items.SaveAllButton, null))
			)
		);
	}
}
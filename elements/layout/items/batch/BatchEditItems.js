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
		
		let projectName = this.getFirstInput("projectName");
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
		
		return <div className="centered-block-for-overflow">
			<Wprr.FlexRow>
				<Wprr.ReferenceInjection injectData={{"items": this._itemsEditor.items, "itemsEditor": this._itemsEditor, "fields": fields}}>
					<Wprr.ExternalStorageInjection initialExternalStorage={this._itemsEditor.editStorage}>
						<Wprr.layout.items.batch.BatchEditHeader title={aSlots.prop("title", Wprr.sourceTranslation("Edit items"))}>
							<div data-slot="operations" />
						</Wprr.layout.items.batch.BatchEditHeader>
						<div className="spacing standard" />
						<Wprr.DataLoader
							loadData={this._loadData}
							loadedCommands={Wprr.commands.callFunction(this, this._addNames, [Wprr.source("event", "raw")])}
						>
							<Wprr.EditableProps editableProps="filteredIds" externalStorage={Wprr.sourceReference("externalStorage")}>
								<Wprr.layout.ItemList ids={Wprr.sourceProp("filteredIds")} className="item-list">
									<Wprr.layout.items.batch.FieldsListItem cellTypes={aSlots.prop("cellTypes", {})} />
								</Wprr.layout.ItemList>
							</Wprr.EditableProps>
						</Wprr.DataLoader>
						<div className="spacing standard" />
						<Wprr.layout.items.batch.BatchEditFooter />
					</Wprr.ExternalStorageInjection>
				</Wprr.ReferenceInjection>
			</Wprr.FlexRow>
		</div>;
	}
}
"use strict";

import React from "react";
import Wprr from "wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import SaveFieldOperations from "./SaveFieldOperations";
export default class SaveFieldOperations extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_createAllPaths(aIncludeTranslations, aIncludeTimeline, aValueArray, aSavedArray) {
		aValueArray.push("value");
		aSavedArray.push("saved.value");
		
		if(aIncludeTranslations) {
			aValueArray.push("value");
			aSavedArray.push("saved.value");
		}
		
		if(aIncludeTimeline) {
			aValueArray.push("value");
			aSavedArray.push("saved.value");
		}
		
	}
	
	_hasFieldChanges(aExternalStorage, aValueFields, aSavedFields) {
		//console.log("_hasFieldChanges");
		//console.log(aExternalStorage, aValueFields, aSavedFields);
		
		let currentArray = aValueFields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let value = aExternalStorage.getValue(currentArray[i]);
			let savedValue = aExternalStorage.getValue(aSavedFields[i]);
			
			if(JSON.stringify(value) !== JSON.stringify(savedValue)) {
				return true;
			}
		}
		
		return false;
	}
	
	_cancelFields(aExternalStorage, aValueFields, aSavedFields) {
		let currentArray = aValueFields;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let value = aExternalStorage.getValue(currentArray[i]);
			let savedValue = aExternalStorage.getValue(aSavedFields[i]);
			
			let savedString = JSON.stringify(savedValue);
			if(JSON.stringify(value) !== savedString) {
				aExternalStorage.updateValue(currentArray[i], JSON.parse(savedString));
				aExternalStorage.updateValue("uiState.workMode", "display");
			}
		}
	}
	
	_saveField() {
		//console.log("_saveField");
		//console.log(this);
		
		let itemsEditor = this.getFirstInput(Wprr.sourceReferenceIfExists("itemsEditor"));
		if(itemsEditor) {
			itemsEditor.saveField(this.getFirstInput(Wprr.sourceReference("field")));
		}
		else {
			let editMessageGroup = this.getFirstInput(Wprr.sourceReference("editMessageGroup/save"));
			editMessageGroup.saveField(this.getFirstInput(Wprr.sourceReference("field/fieldName")));
		}
	}
	
	_renderMainElement() {
		
		let statusFieldName = "uiState.status";
		
		let includeTranslations = this.getFirstInputWithDefault("includeTranslations", false);
		let includeTimeline = this.getFirstInputWithDefault("includeTimeline", false);
		
		let allFields = {
			"valueFields": new Array(),
			"savedFields": new Array()
		};
		
		this._createAllPaths(includeTranslations, includeTimeline, allFields.valueFields, allFields.savedFields);
		
		let saveCommands = Wprr.commands.callFunction(this, this._saveField); //Wprr.commands.callFunction(Wprr.sourceReference("editMessageGroup/save"), "saveField", [Wprr.sourceReference("field/fieldName")]);
		let cancelCommands = Wprr.commands.callFunction(this, this._cancelFields, [Wprr.sourceReference("field/externalStorage"), allFields.valueFields, allFields.savedFields]);
		
		return React.createElement("wrapper", null,
			React.createElement(Wprr.OpenCloseExpandableArea, {"open": Wprr.sourceReference("field", "field.sources.value.sources.changed")}, 
				React.createElement("div", {className: "spacing micro save-field-operations-spacing"}),
					React.createElement(Wprr.FlexRow, {className: "justify-between"},
						React.createElement(Wprr.CommandButton, {commands: cancelCommands},
							React.createElement("div", {className: "small-text-bold cursor-pointer"},
								Wprr.idText("Cancel", "site.cancel")
							)
						),
						React.createElement("div", null, React.createElement(Wprr.ExternalStorageProps, {props: statusFieldName, externalStorage: Wprr.sourceReference("field/externalStorage")},
							React.createElement(Wprr.SelectSection, {selectedSections: Wprr.source("propWithDots", statusFieldName)},
								React.createElement("div", {"data-section-name": "saving"},
									React.createElement("div", {className: "small-text-bold"},
										Wprr.translateText("Saving...")
									)
								),
								React.createElement("div", {"data-section-name": "normal", "data-default-section": true},
									React.createElement(Wprr.CommandButton, {commands: saveCommands},
										React.createElement("div", {className: "small-text-bold cursor-pointer"},
											Wprr.idText("Save", "site.save")
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
}

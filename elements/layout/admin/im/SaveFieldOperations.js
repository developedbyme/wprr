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
		console.log("_saveField");
		console.log(this);
		
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
		let fieldNames = [].concat(allFields.valueFields, allFields.savedFields);
		
		let compareAdjust = Wprr.adjusts.condition(
			Wprr.source("command", Wprr.commands.callFunction(this, this._hasFieldChanges, [Wprr.sourceReference("field/externalStorage"), allFields.valueFields, allFields.savedFields])),
			true,
			"===",
			"open"
		);
		
		let saveCommands = Wprr.commands.callFunction(this, this._saveField); //Wprr.commands.callFunction(Wprr.sourceReference("editMessageGroup/save"), "saveField", [Wprr.sourceReference("field/fieldName")]);
		let cancelCommands = Wprr.commands.callFunction(this, this._cancelFields, [Wprr.sourceReference("field/externalStorage"), allFields.valueFields, allFields.savedFields]);
		
		return React.createElement("wrapper", null, /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: fieldNames,
  externalStorage: Wprr.sourceReference("field/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Adjust, {
  adjust: compareAdjust
}, /*#__PURE__*/React.createElement(Wprr.OpenCloseExpandableArea, null, /*#__PURE__*/React.createElement("div", {
  className: "spacing micro save-field-operations-spacing"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between"
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: cancelCommands
}, /*#__PURE__*/React.createElement("div", {
  className: "small-text-bold cursor-pointer"
}, Wprr.translateText("Cancel"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: statusFieldName,
  externalStorage: Wprr.sourceReference("field/externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.SelectSection, {
  selectedSections: Wprr.source("propWithDots", statusFieldName)
}, /*#__PURE__*/React.createElement("div", {
  "data-section-name": "saving"
}, /*#__PURE__*/React.createElement("div", {
  className: "small-text-bold"
}, Wprr.translateText("Saving..."))), /*#__PURE__*/React.createElement("div", {
  "data-section-name": "normal",
  "data-default-section": true
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: saveCommands
}, /*#__PURE__*/React.createElement("div", {
  className: "small-text-bold cursor-pointer"
}, Wprr.translateText("Save"))))))))))));
	}
}

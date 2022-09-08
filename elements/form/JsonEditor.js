import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";
import ReactJson from 'react-json-view'

export default class JsonEditor extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._callback_onEditBound = this._callback_onEdit.bind(this);
		this._callback_onAddBound = this._callback_onAdd.bind(this);
		this._callback_onDeleteBound = this._callback_onDelete.bind(this);
		
		
		
		let value = this.getValue();
		if(value) {
			this._elementTreeItem.setValue("mode", "json");
			this._elementTreeItem.setValue("rawText", JSON.stringify(value));
		}
		else {
			this._elementTreeItem.setValue("mode", "raw");
			this._elementTreeItem.setValue("rawText", "" + value);
		}
		
	}
	
	commitRawChanges() {
		let dataString = this._elementTreeItem.getValue("rawText");
		let data = null;
		let isOk = true;
		
		try {
			data = JSON.parse(dataString);
		}
		catch(theError) {
			alert("Not a valid json: " + theError.message);
			isOk = false;
		}
		if(isOk) {
			this._updateValue(data);
			this._elementTreeItem.setValue("mode", "json");
		}
	}
	
	cancelRawChanges() {
		
		let value = this.getValue();
		if(value) {
			this._elementTreeItem.setValue("rawText", JSON.stringify(value));
		}
		else {
			this._elementTreeItem.setValue("rawText", "");
		}
		
		this._elementTreeItem.setValue("mode", "json");
	}
	
	_updateValue(aValue) {
		let newValue = aValue;
		
		let valueName = this.getSourcedProp("valueName");
		
		this._elementTreeItem.setValue("rawText", JSON.stringify(aValue));
		this.updateProp("value", newValue);
		
		let valueReference = this.getReference("value/" + valueName);
		if(valueReference) {
			valueReference.updateValue(valueName, newValue);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	getValue() {
		let valueName = this.getSourcedProp("valueName");
		
		let value = this.getSourcedPropWithDefault("value", Wprr.source("propWithDots", valueName));
		return value;
	}
	
	_callback_onEdit(aData) {
		console.log("_callback_onEdit");
		console.log(aData);
		
		this._updateValue(aData["updated_src"]);
	}
	
	_callback_onAdd(aData) {
		console.log("_callback_onAdd");
		console.log(aData);
		
		this._updateValue(aData["updated_src"]);
	}
	
	_callback_onDelete(aData) {
		console.log("_callback_onDelete");
		console.log(aData);
		
		this._updateValue(aData["updated_src"]);
	}
	
	_renderMainElement() {
		
		let value = this.getValue();
		
		return React.createElement("div", {},
			React.createElement(Wprr.SelectSection, {"selectedSections": this._elementTreeItem.getValueSource("mode")},
				React.createElement("div", {"data-default-section": true}, 
					React.createElement(ReactJson, {"name": null, "src": value, "collapsed": true, "onEdit": this._callback_onEditBound, "onAdd": this._callback_onAddBound, "onDelete": this._callback_onDeleteBound}),
					React.createElement(Wprr.layout.interaction.Button, {"className": "edit-button edit-button-padding cursor-pointer", "commands": Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "raw"), "text": Wprr.sourceTranslation("Raw editor", "site.rawEditor")})
				),
				React.createElement("div", {"data-section-name": "raw"},
					React.createElement(Wprr.TextArea, {"value": this._elementTreeItem.getValueSource("rawText"), "className": "full-width"}),
					React.createElement(Wprr.FlexRow, {"className": "justify-between"},
						React.createElement(Wprr.layout.interaction.Button, {"className": "edit-button edit-button-padding cursor-pointer", "commands": Wprr.commands.callFunction(this, this.cancelRawChanges), "text": Wprr.sourceTranslation("cancel", "site.cancel")}),
						React.createElement(Wprr.layout.interaction.Button, {"className": "edit-button edit-button-padding cursor-pointer", "commands": Wprr.commands.callFunction(this, this.commitRawChanges), "text": Wprr.sourceTranslation("commit", "site.commit")})
					)
				)
			)
		);
	}
}
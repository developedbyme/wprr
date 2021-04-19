import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";
import ReactJson from 'react-json-view'

export default class Json extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._callback_onEditBound = this._callback_onEdit.bind(this);
		this._callback_onAddBound = this._callback_onAdd.bind(this);
		this._callback_onDeleteBound = this._callback_onDelete.bind(this);
		
		this._mode = Wprr.sourceValue("editor");
		this._rawData = Wprr.sourceValue("rawData");
	}
	
	_updateValue(aValue) {
		let externalStorage = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
		externalStorage.updateValue("value", aValue);
	}
	
	changeToRaw() {
		console.log("changeToRaw");
		
		let externalStorage = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
		this._rawData.value = JSON.stringify(externalStorage.getValue("value"), null, "\t");
		
		console.log(externalStorage, this._rawData);
		
		this._mode.value = "raw";
	}
	
	commitRawChanges() {
		let dataString = this._rawData.value;
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
			this._mode.value = "editor";
		}
	}
	
	cancelRawChanges() {
		this._mode.value = "editor";
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
		
		return React.createElement("div", {className: "standard-field standard-field-padding full-width"},
			React.createElement(Wprr.SelectSection, {"selectedSections": this._mode},
				React.createElement("div", {"data-default-section": true}, 
					React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
						React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.renameProp(["value"], ["src"])},
							React.createElement(ReactJson, {"name": null, "collapsed": true, "onEdit": this._callback_onEditBound, "onAdd": this._callback_onAddBound, "onDelete": this._callback_onDeleteBound})
						)
					),
					React.createElement(Wprr.layout.interaction.Button, {"className": "edit-button edit-button-padding cursor-pointer", "commands": Wprr.commands.callFunction(this, this.changeToRaw), "text": Wprr.sourceTranslation("Raw editor", "site.rawEditor")})
				),
				React.createElement("div", {"data-section-name": "raw"},
					React.createElement(Wprr.TextArea, {"value": this._rawData, "className": "full-width"}),
					React.createElement(Wprr.FlexRow, {"className": "justify-between"},
						React.createElement(Wprr.layout.interaction.Button, {"className": "edit-button edit-button-padding cursor-pointer", "commands": Wprr.commands.callFunction(this, this.cancelRawChanges), "text": Wprr.sourceTranslation("cancel", "site.cancel")}),
						React.createElement(Wprr.layout.interaction.Button, {"className": "edit-button edit-button-padding cursor-pointer", "commands": Wprr.commands.callFunction(this, this.commitRawChanges), "text": Wprr.sourceTranslation("commit", "site.commit")})
					)
				)
			)
		);
	}
}
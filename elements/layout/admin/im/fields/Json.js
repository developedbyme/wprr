import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";
import ReactJson from 'react-json-view'

export default class Address extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._callback_onEditBound = this._callback_onEdit.bind(this);
		this._callback_onAddBound = this._callback_onAdd.bind(this);
		this._callback_onDeleteBound = this._callback_onDelete.bind(this);
	}
	
	_updateValue(aValue) {
		let externalStorage = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
		externalStorage.updateValue("value", aValue);
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
			React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
				React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.renameProp(["value"], ["src"])},
					React.createElement(ReactJson, {"name": null, "collapsed": true, "onEdit": this._callback_onEditBound, "onAdd": this._callback_onAddBound, "onDelete": this._callback_onDeleteBound})
				)
			)
		);
	}
}
import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";
import ReactJson from 'react-json-view'

export default class JsonEditor extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._callback_onEditBound = this._callback_onEdit.bind(this);
		this._callback_onAddBound = this._callback_onAdd.bind(this);
		this._callback_onDeleteBound = this._callback_onDelete.bind(this);
	}
	
	_updateValue(aValue) {
		let newValue = aValue;
		
		let valueName = this.getSourcedProp("valueName");
		
		this.getReference("value/" + valueName).updateValue(valueName, newValue);
		
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
			React.createElement(ReactJson, {"name": null, "src": value, "collapsed": true, "onEdit": this._callback_onEditBound, "onAdd": this._callback_onAddBound, "onDelete": this._callback_onDeleteBound})
		);
	}
}
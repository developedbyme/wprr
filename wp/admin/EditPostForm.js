import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import DataStorage from "wprr/utils/DataStorage";

import Wprr from "wprr/Wprr";

// import EditPostForm from "wprr/wp/admin/EditPostForm";
export default class EditPostForm extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._originalData = new DataStorage();
		this._externalData = new DataStorage();
	}
	
	setupPostData(aData) {
		//console.log("wprr/wp/admin/EditPostForm::setupPostData");
		
		//console.log(aData);
		
		for(let objectName in aData) {
			switch(objectName) {
				case "id":
				case "permalink":
					//MENOTE: do nothing
					break;
				default:
					this._originalData.updateValue(objectName, JSON.parse(JSON.stringify(aData[objectName])));
					this._externalData.updateValue(objectName, JSON.parse(JSON.stringify(aData[objectName])));
					break;
			}
		}
		
		//console.log(this._externalData);
		
		let commands = this.getSourcedProp("setupCommands");
		if(commands) {
			Wprr.utils.commandPerformer.perform(commands, this._externalData, this);
		}
	}
	
	_getLoader(aChangeData) {
		let loader = new Wprr.utils.JsonLoader();
		
		let editId = this.getSourcedProp("id");
		let postType = this.getSourcedPropWithDefault("postType", "post");
		
		let path = this.getReference("wprr/paths/rest") + "wprr/v1/admin/";
		let body;
		
		if(editId) {
			path += "post/" + editId + "/edit";
			body = aChangeData.getEditData();
		}
		else {
			path += postType +"/create";
			body = aChangeData.getCreateData();
		}
		
		loader.setupJsonPost(path, body);
		
		let userData = this.getReference("wprr/userData");
		if(userData) {
			let nonce = userData.restNonce;
			loader.addHeader("X-WP-Nonce", nonce);
		}
		
		return loader;
	}
	
	_getApplyChangeFunction(aFieldName) {
		
		let applyFunction = this.getFirstValidSource(
			Wprr.sourceProp("apply_" + aFieldName),
			Wprr.sourceReference("wprr/editPost/apply/" + aFieldName),
			EditPostForm.defaultApplyChange
		);
		
		return applyFunction;
	}
	
	static defaultApplyChange(aFieldName, aValue, aChangeData) {
		switch(aFieldName) {
			case "title":
				aChangeData.setTitle(aValue);
				break;
			case "content":
			case "slug":
			case "parent":
			case "status":
				aChangeData.setField(aFieldName, aValue);
				break;
			default:
				aChangeData.setMeta(aFieldName, aValue);
				break;
		}
	}
	
	applyChange(aFieldName, aValue, aChangeData) {
		let applyFunction = this._getApplyChangeFunction(aFieldName);
		applyFunction.call(this, aFieldName, aValue, aChangeData);
	}
	
	getChangeData() {
		//console.log("wprr/wp/admin/EditPostForm::getChangeData");
		
		let changeData = new Wprr.utils.ChangeData();
		
		let editId = this.getSourcedProp("id");
		if(!editId) {
			let createChangeData = this.getSourcedProp("createChangeData");
			if(createChangeData) {
				changeData.addChanges(createChangeData.getChanges());
			}
		}
		
		let originalData = this._originalData.getData();
		let data = this._externalData.getData();
		
		for(let objectName in data) {
			let currentValue = data[objectName];
			let originalValue = originalData[objectName];
			
			if(currentValue !== originalValue) {
				this.applyChange(objectName, currentValue, changeData);
			}
		}
		
		let additionalChangeData = this.getSourcedProp("additionalChangeData");
		if(additionalChangeData) {
			changeData.addChanges(additionalChangeData.getChanges());
		}
		
		return changeData;
	}
	
	_saved(aId) {
		//console.log("wprr/wp/admin/EditPostForm::_saved");
		
		let commands = this.getSourcedProp("savedCommands");
		if(commands) {
			Wprr.utils.commandPerformer.perform(commands, aId, this);
		}
	}
	
	_errorSaving() {
		//console.log("wprr/wp/admin/EditPostForm::_errorSaving");
		
		let commands = this.getSourcedProp("errorCommands");
		if(commands) {
			Wprr.utils.commandPerformer.perform(commands, null, this);
		}
	}
	
	publish() {
		//console.log("wprr/wp/admin/EditPostForm::publish");
		
		let commands = this.getSourcedProp("prepareSaveCommands");
		if(commands) {
			Wprr.utils.commandPerformer.perform(commands, this._externalData, this);
		}
		
		let changeData = this.getChangeData();
		changeData.setField("status", "publish");
		
		let loader = this._getLoader(changeData);
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._saved, [Wprr.source("event", "raw", "data.id")]));
		loader.addErrorCommand(Wprr.commands.callFunction(this, this._errorSaving));
		loader.load();
	}
	
	save() {
		//console.log("wprr/wp/admin/EditPostForm::save");
		
		let commands = this.getSourcedProp("prepareSaveCommands");
		if(commands) {
			Wprr.utils.commandPerformer.perform(commands, null, this);
		}
		
		let changeData = this.getChangeData();
		
		let loader = this._getLoader(changeData);
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._saved, [Wprr.source("event", "raw", "data.id")]));
		loader.addErrorCommand(Wprr.commands.callFunction(this, this._errorSaving));
		loader.load();
	}
	
	_renderMainElement() {
		
		let editId = this.getSourcedProp("id");
		let postType = this.getSourcedPropWithDefault("postType", "post");
		
		let encodings = this.getSourcedPropWithDefault("encodings", "editFields");
		
		let mode = editId ? "edit" : "create";
		
		let mainElement = React.createElement(Wprr.ReferenceInjection,
			{
				"injectData": {
					"wprr/editPost/mode": mode,
					"wprr/editPost/externalStorage": this._externalData,
					"trigger/publish": this,
					"trigger/save": this
				}
			},
			this.props.children
		);
		
		if(editId) {
			let additionalSelections = this.getSourcedProp("additionalSelections");
			let selection = this.getFirstInputWithDefault("selection", "idSelection");
			if(additionalSelections) {
				selection += "," + additionalSelections;
			}
			
			mainElement = React.createElement(Wprr.DataLoader,
				{
					"loadData": {"postData": "wprr/v1/range-item/" + postType + "/" + selection +"/" + encodings + "?ids=" + editId},
					"loadedCommands": Wprr.commands.callFunction(this, this.setupPostData, [Wprr.source("event", "raw", "postData")])
				},
				mainElement
			);
		}
		
		return React.createElement("wrapper", {}, mainElement);
	}
}
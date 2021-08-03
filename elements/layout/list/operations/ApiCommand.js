import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import moment from "moment";

export default class ApiCommand extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._updatedIds = Wprr.sourceValue([]);
		
		this._url = Wprr.sourceValue(Wprr.utils.wprrUrl.getEditUrl("{id}"));
		this._payload = Wprr.sourceValue({"changes": []});
	}
	
	_update() {
		console.log("_update");
		
		let selectedIds = this.getFirstInput(Wprr.sourceReference("externalStorage", "selection"));
		let items = this.getFirstInput(Wprr.sourceReference("items"));
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loadingSequence = Wprr.utils.loading.LoadingSequence.create();
		loadingSequence._numberOfConcurrentLoaders = 1;
		let baseUrl = this.getWprrUrl(this._url.value);
		
		let payload = this._payload.value;
		
		let currentArray = selectedIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentId = currentArray[i];
			let currentItem = items.getItem(currentId);
			
			let currentLoader = project.getLoader();
			
			let url = baseUrl.split("{id}").join(currentId);
			currentLoader.setupJsonPost(url, payload);
			
			loadingSequence.addLoader(currentLoader);
		}
		
		loadingSequence.load();
	}
	
	_setPayloadFile(aFileData) {
		console.log("_setPayloadFile");
		console.log(aFileData);
		
		let data = JSON.parse(aFileData);
		if(data) {
			this._payload.value = data;
		}
	}
	
	_loadPayloadFile(aFile) {
		console.log("_setPayload");
		console.log(aFile);
		
		if(aFile) {
			let loader = new Wprr.utils.loading.LocalFileLoader();
			loader.setFileReference(aFile);
			loader.setReadMode("text");
			
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._setPayloadFile, [Wprr.sourceEvent()]));
			loader.load();
		}
		
	}
	
	_renderMainElement() {
		
		return React.createElement("div", null,
				React.createElement(Wprr.layout.form.LabelledArea, {"label": Wprr.sourceTranslation("Url")},
					React.createElement(Wprr.FormField, {value: this._url, "className": "standard-field standard-field-padding full-width"}),
				),
				React.createElement("div", {"className": "spacing standard"}),
				React.createElement(Wprr.layout.form.LabelledArea, {"label": Wprr.sourceTranslation("Payload")},
					React.createElement(Wprr.JsonEditor, {value: this._payload, "className": "standard-field standard-field-padding full-width"}),
				),
				React.createElement(Wprr.FormField, {"type": "file", "className": "full-width", "changeCommands": Wprr.commands.callFunction(this, this._loadPayloadFile, [Wprr.sourceEvent("0")])}),
				React.createElement("div", {"className": "spacing standard"}),
				React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this._update)},
					React.createElement("div", {className: "standard-button standard-button-padding"},
						Wprr.idText("Run commands", "site.admin.runCommands")
					)
				)
		);
	}
}

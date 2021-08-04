import React from "react";
import Wprr from "wprr/Wprr";

export default class PostApiCommand extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._url = Wprr.sourceValue(Wprr.utils.wprrUrl.getEditUrl("{id}"));
		this._payload = Wprr.sourceValue({"changes": []});
	}
	
	_update() {
		console.log("_update");
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let url = this.getWprrUrl(this._url.value);
		
		let payload = this._payload.value;
		
		let currentLoader = project.getLoader();
		currentLoader.setupJsonPost(url, payload);
		
		currentLoader.load();
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
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		this._url.value = Wprr.utils.wprrUrl.getEditUrl(this.getFirstInput(Wprr.sourceQueryString("id")));
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
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {
  dataSettings: dataSettings
});
	}
}

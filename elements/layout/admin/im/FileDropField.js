import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class FileDropField extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._externalStorage = new Wprr.utils.DataStorage();
		this._externalStorage.updateValue("dropHighlightClass", "");
		this._externalStorage.updateValue("files", []);
		
		this._nextInternalId = 0;
		this._fieldId = Math.round(Math.random()*10000000000);
	}
	
	_getLoader() {
		let loader = new Wprr.utils.JsonLoader();
		
		let userData = this.getReference("wprr/userData");
		if(userData) {
			loader.addHeader("X-WP-Nonce", userData.restNonce);
		}
		
		return loader;
	}
	
	_getLoaderForFile(aFile) {
		console.log(aFile, 'upload file');
		
		let internalId = this._nextInternalId++;
		
		this._externalStorage.addValueToArray("files", {"fileName": aFile["name"], "id": 0, "url": null, "status": "uploading", "internalId": internalId});
		
		let fieldName = this.getFirstInput("fieldName", Wprr.sourceReference("field", "field.key"));
		
		let messageGroupId = this.getFirstInput(Wprr.sourceProp("messageGroupId"), Wprr.sourceReference("messageGroup", "id"), Wprr.sourceReference("item", "id"));
		
		let body = new FormData();
		body.append('file', aFile);
		
		let loader = this._getLoader();
		loader.setupPost(this.getWprrUrl("/wp-json/dbm-content-transactional-communication/v1/internal-message-group/" + messageGroupId + "/field/" + fieldName + "/upload"), body);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._fileUploaded, [internalId, Wprr.source("event", "raw", "data")]));
		
		return loader;
	}
	
	_fileUploaded(aInternalId, aData) {
		console.log("_fileUploaded");
		console.log(aInternalId, aData);
		
		let files = this._externalStorage.getValue("files");
		let index = Wprr.utils.array.getItemIndexByIfExists("internalId", aInternalId, files);
		console.log(index);
		if(index >= 0) {
			this._externalStorage.updateValue("files." + index + ".url", aData["url"]);
			this._externalStorage.updateValue("files." + index + ".id", aData["id"]);
			this._externalStorage.updateValue("files." + index + ".status", "added");
		}
	}
	
	_removeFile(aInternalId) {
		console.log("_removeFile");
		console.log(aInternalId);
		
		let files = this._externalStorage.getValue("files");
		let index = Wprr.utils.array.getItemIndexByIfExists("internalId", aInternalId, files);
		console.log(index);
		
		if(index >= 0) {
			
			let messageGroupId = this.getFirstInput(Wprr.sourceProp("messageGroupId"), Wprr.sourceReference("messageGroup", "id"));
			let fileId = files[index]["id"];
			console.log(fileId);
			this._externalStorage.updateValue("files." + index + ".status", "removing");
			
			let changeData = new Wprr.utils.ChangeData();
			changeData.createChange("dbmtc/removeFileFromField", {"value": fileId, "field": "receipts"});
		
			let loader = this._getLoader();
			loader.setupJsonPost(this.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(messageGroupId)), changeData.getEditData());
			
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._fileRemoved, [aInternalId, Wprr.source("event", "raw", "data")]));
			
			loader.load();
		}
	}
	
	_fileRemoved(aInternalId) {
		console.log("_fileRemoved");
		console.log(aInternalId);
		
		let files = this._externalStorage.getValue("files");
		let index = Wprr.utils.array.getItemIndexByIfExists("internalId", aInternalId, files);
		console.log(index);
		
		if(index >= 0) {
			let newFiles = [].concat(files);
			newFiles.splice(index, 1);
			this._externalStorage.updateValue("files", newFiles);
		}
	}

	_handleFiles(aFiles) {
		
		let loadingSequence = new Wprr.utils.LoadingSequence();
		loadingSequence._numberOfConcurrentLoaders = 1;
		
		let currentArray = aFiles;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let file = currentArray[i];
			
			//METODO: check file type
			let loader = this._getLoaderForFile(file);
			
			loadingSequence.addLoader(loader);
		}
		
		loadingSequence.load();
	}
	
	_fileSelected(aFiles) {
		console.log("_fileSelected");
		console.log(aFiles);
		
		if(aFiles && aFiles.length) {
			this._handleFiles(aFiles);
		}
	}

	_highlight(e) {
		e.preventDefault()
		e.stopPropagation()
		
		this._externalStorage.updateValue("dropHighlightClass", "drop-file-highlight");
	}

	_unhighlight(e) {
		e.preventDefault()
		e.stopPropagation()
		
		this._externalStorage.updateValue("dropHighlightClass", "");
	}

	_handleDrop(e) {
		e.preventDefault()
		e.stopPropagation()
		
		this._externalStorage.updateValue("dropHighlightClass", "");
		
		let dt = e.dataTransfer;
		let files = dt.files;

		this._handleFiles(files);
	}
	
	_prepareInitialRender() {
		let files = this.getFirstInputWithDefault("initialFiles", Wprr.sourceReference("field", "field.value"), []);
		console.log(">>>>>>>>", files, this.getFirstInput(Wprr.sourceReference("field", "field")));
		if(files && !Array.isArray(files)) {
			files = [files];
		}
		
		let internalFiles = new Array();
		let currentArray = files;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let file = currentArray[i];
			let internalId = this._nextInternalId++;
		
			let newInternalFile = {"fileName": file["name"], "id": file["id"], "url": file["url"], "status": "added", "internalId": internalId};
			internalFiles.push(newInternalFile);
		}
		
		this._externalStorage.updateValue("files", internalFiles);
	}
	
	_renderMainElement() {
		
		let fieldName = this.getFirstInput("fieldName", Wprr.sourceReference("field", "field.key"));
		
		let id = fieldName + "-file-field-" + this._fieldId; //METODO: set this better
		
		let fileItem = React.createElement(Wprr.ExternalStorageConnectionInjection, {prefix: Wprr.source("combine", ["files.", Wprr.sourceReference("loop/index")]), externalStorage: Wprr.sourceReference("externalStorage")},
			React.createElement("div", {className: "uploaded-file-field standard-field-padding"},
				React.createElement(Wprr.FlexRow, {className: "justify-between micro-item-spacing vertically-center-items", itemClasses: "flex-no-resize,flex-resize,flex-no-resize"},
					React.createElement(Wprr.Image, { className: "icon standard-icon background-contain", src: "icons/common-file-empty.svg"}),
					React.createElement(Wprr.ExternalStorageProps, {props: "url", externalStorage: Wprr.sourceReference("externalStorage")},
						React.createElement(Wprr.Link, { className: "custom-styled-link", href: Wprr.sourceProp("url"), target: "_blank"},
							React.createElement(Wprr.ExternalStorageProps, { props: "fileName", externalStorage: Wprr.sourceReference("externalStorage")},
								Wprr.text(Wprr.sourceProp("fileName"))
							)
						)
					),
					React.createElement(Wprr.ExternalStorageProps, {props: "status", externalStorage: Wprr.sourceReference("externalStorage")},
						React.createElement(Wprr.SelectSection, { selectedSections: Wprr.sourceProp("status")},
							React.createElement("div", {"data-section-name": "uploading"},
								Wprr.idText("Uploading...", "site.progress.uploading")
							),
							React.createElement("div", {"data-section-name": "added"},
								React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this._removeFile, [Wprr.sourceReference("externalStorage", "internalId")])},
									React.createElement(Wprr.Image, {className: "icon standard-icon background-contain cursor-pointer", src: "icons/delete.svg"})
								)
							),
							React.createElement("div", {"data-section-name": "removing"},
								Wprr.idText("Removing...", "site.progress.uploading")
							)
						)
					)
				)
			)
		);
		
		return React.createElement("div", null,
			React.createElement(Wprr.ExternalStorageInjection, {initialExternalStorage: this._externalStorage},
				React.createElement(Wprr.FormField, {className: "skip-default display-none", type: "file", id: id, multiple: "multiple", changeCommands: Wprr.commands.callFunction(this, this._fileSelected, [Wprr.source("event", "raw")])}),
				React.createElement(Wprr.EventCommands, {events: { onDragEnter: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]), onDragOver: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]), onDragLeave: Wprr.commands.callFunction(this, this._unhighlight, [Wprr.source("event", "raw")]),  onDrop: Wprr.commands.callFunction(this, this._handleDrop, [Wprr.source("event", "raw")])}},
					React.createElement(Wprr.ExternalStorageProps, {props: "files", externalStorage: Wprr.sourceReference("externalStorage")},
						React.createElement(Wprr.HasData, {check: Wprr.sourceProp("files")},
							Wprr.Loop.createMarkupLoop(Wprr.sourceProp("files"), fileItem, React.createElement("div", {className: "spacing small"})), React.createElement("div", {className: "spacing small"})
						)
					),
					React.createElement(Wprr.AddProps, {className: Wprr.sourceReference("externalStorage", "dropHighlightClass")}, 
						React.createElement("label", {htmlFor: id, className: "drop-area drop-area-padding display-block cursor-pointer"},
							React.createElement(Wprr.FlexRow, {className: "justify-center small-item-spacing vertically-center-items"},
								React.createElement(Wprr.Image, {className: "icon standard-icon", src: "icons/add-circle.svg"}),
								React.createElement("div", {className: "drop-area-drop-label"},
									Wprr.idText("Choose a file or drop it here", "site.addOrDropFiles")
								)
							)
						)
					)
				)
			)
		);
	}
}

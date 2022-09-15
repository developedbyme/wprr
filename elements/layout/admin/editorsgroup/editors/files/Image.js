import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class Image extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._externalStorage = new Wprr.utils.DataStorage();
		this._externalStorage.updateValue("dropHighlightClass", "");
		
		this._nextInternalId = 0;
		this._fieldId = Math.round(Math.random()*10000000000);
		
		this.addValueSourceFromProp("value");
		this._elementTreeItem.requireValue("status", "none");
		this._elementTreeItem.requireValue("dropHighlightClass", "");
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
		
		let fieldName = this.getFirstInput("fieldName");
		
		let messageGroupId = this.getFirstInput(Wprr.sourceProp("messageGroupId"), Wprr.sourceReference("messageGroup", "id"), Wprr.sourceReference("item", "id"));
		
		let body = new FormData();
		body.append('file', aFile);
		
		let loader = this._getLoader();
		loader.setupPost(this.getWprrUrl("/wp-json/dbm-content-transactional-communication/v1/internal-message-group/" + messageGroupId + "/field/" + fieldName + "/upload"), body);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._fileUploaded, [aFile["name"], Wprr.source("event", "raw", "data")]));
		
		return loader;
	}
	
	_fileUploaded(aName, aData) {
		console.log("_fileUploaded");
		console.log(aData);
		
		this._elementTreeItem.setValue("value", {"id": aData["id"], "name": aName, "url": aData["url"]});
		this._elementTreeItem.setValue("status", "none");
	}
	
	_removeFile() {
		console.log("_removeFile");
		
		this._elementTreeItem.setValue("value", null);
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
			
			this._elementTreeItem.setValue("value", null);
			this._elementTreeItem.setValue("status", "uploading");
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
		
		this._elementTreeItem.setValue("dropHighlightClass", "drop-file-highlight");
	}

	_unhighlight(e) {
		e.preventDefault()
		e.stopPropagation()
		
		this._elementTreeItem.setValue("dropHighlightClass", "");
	}

	_handleDrop(e) {
		e.preventDefault()
		e.stopPropagation()
		
		this._elementTreeItem.setValue("dropHighlightClass", "");
		
		let dt = e.dataTransfer;
		let files = dt.files;

		this._handleFiles(files);
	}
	
	_renderMainElement() {
		
		let id = "file-field-" + this._fieldId;
		
		return React.createElement("div", null,
			React.createElement(Wprr.FormField, {className: "skip-default display-none", type: "file", id: id, multiple: "multiple", changeCommands: Wprr.commands.callFunction(this, this._fileSelected, [Wprr.source("event", "raw")])}),
			React.createElement(Wprr.EventCommands, {events: { onDragEnter: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]), onDragOver: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]), onDragLeave: Wprr.commands.callFunction(this, this._unhighlight, [Wprr.source("event", "raw")]),  onDrop: Wprr.commands.callFunction(this, this._handleDrop, [Wprr.source("event", "raw")])}},
				React.createElement(Wprr.HasData, {check: this._elementTreeItem.getValueSource("value")},
					React.createElement(Wprr.AddProps, {className: this._elementTreeItem.getValueSource("dropHighlightClass")},
						React.createElement("div", {className: "drop-area uploaded-file-field standard-field-padding"},
							React.createElement(Wprr.FlexRow, {className: "justify-between micro-item-spacing vertically-center-items flex-no-wrap", itemClasses: "flex-no-resize,flex-resize,flex-no-resize"},
								React.createElement(Wprr.Image, { className: "icon standard-icon background-contain", src: Wprr.sourceStatic(this._elementTreeItem.getValueSource("value"), "url")}),
								React.createElement(Wprr.Link, { className: "custom-styled-link", href: Wprr.sourceStatic(this._elementTreeItem.getValueSource("value"), "url"), target: "_blank"},
									Wprr.text(Wprr.sourceStatic(this._elementTreeItem.getValueSource("value"), "name"))
								),
								React.createElement(Wprr.CommandButton, {commands: Wprr.commands.callFunction(this, this._removeFile, [])},
									React.createElement(Wprr.Image, {className: "icon standard-icon background-contain cursor-pointer", src: "icons/remove.svg"})
								)
							)
						)
					)
				),
				React.createElement(Wprr.HasData, {check: this._elementTreeItem.getValueSource("value"), "checkType": "invert/default"},
					React.createElement(Wprr.SelectSection, {"selectedSections": this._elementTreeItem.getValueSource("status")},
						React.createElement("div", {"data-section-name": "uploading"},
							React.createElement("div", {className: "uploaded-file-field standard-field-padding"},
								Wprr.idText("Uploading...", "site.progress.uploading")
							)
						),
						React.createElement("div", {"data-default-section": true},
							React.createElement(Wprr.AddProps, {className: this._elementTreeItem.getValueSource("dropHighlightClass")},
								React.createElement("label", {htmlFor: id, className: "drop-area drop-area-padding display-block cursor-pointer"},
									React.createElement(Wprr.FlexRow, {className: "justify-center small-item-spacing vertically-center-items"},
										React.createElement(Wprr.Image, {className: "icon standard-icon background-contain", src: "icons/add-circle.svg"}),
										React.createElement("div", {className: "drop-area-drop-label"},
											Wprr.idText("Choose a file or drop it here", "site.addOrDropFiles")
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

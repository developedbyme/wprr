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
		
		let id = fieldName + "-file-field"; //METODO: set this better
		
		let fileItem = React.createElement(Wprr.ExternalStorageConnectionInjection, {
  prefix: Wprr.source("combine", ["files.", Wprr.sourceReference("loop/index")]),
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement("div", {
  className: "uploaded-file-field standard-field-padding"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between micro-item-spacing vertically-center-items",
  itemClasses: "flex-no-resize,flex-resize,flex-no-resize"
}, /*#__PURE__*/React.createElement(Wprr.Image, {
  className: "icon standard-icon background-contain",
  src: "icons/common-file-empty.svg"
}), /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: "url",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.Link, {
  className: "custom-styled-link",
  href: Wprr.sourceProp("url"),
  target: "_blank"
}, /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: "fileName",
  externalStorage: Wprr.sourceReference("externalStorage")
}, Wprr.text(Wprr.sourceProp("fileName"))))), /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: "status",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.SelectSection, {
  selectedSections: Wprr.sourceProp("status")
}, /*#__PURE__*/React.createElement("div", {
  "data-section-name": "uploading"
}, Wprr.idText("Uploading...", "site.progress.uploading")), /*#__PURE__*/React.createElement("div", {
  "data-section-name": "added"
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this._removeFile, [Wprr.sourceReference("externalStorage", "internalId")])
}, /*#__PURE__*/React.createElement(Wprr.Image, {
  className: "icon standard-icon background-contain cursor-pointer",
  src: "icons/delete.svg"
}))), /*#__PURE__*/React.createElement("div", {
  "data-section-name": "removing"
}, Wprr.idText("Removing...", "site.progress.uploading")))))));
		
		return React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.ExternalStorageInjection, {
  initialExternalStorage: this._externalStorage
}, /*#__PURE__*/React.createElement(Wprr.FormField, {
  className: "display-none",
  type: "file",
  id: id,
  multiple: "multiple",
  changeCommands: Wprr.commands.callFunction(this, this._fileSelected, [Wprr.source("event", "raw")])
}), /*#__PURE__*/React.createElement(Wprr.EventCommands, {
  events: {
    onDragEnter: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]),
    onDragOver: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]),
    onDragLeave: Wprr.commands.callFunction(this, this._unhighlight, [Wprr.source("event", "raw")]),
    onDrop: Wprr.commands.callFunction(this, this._handleDrop, [Wprr.source("event", "raw")])
  }
}, /*#__PURE__*/React.createElement(Wprr.ExternalStorageProps, {
  props: "files",
  externalStorage: Wprr.sourceReference("externalStorage")
}, /*#__PURE__*/React.createElement(Wprr.HasData, {
  check: Wprr.sourceProp("files")
}, Wprr.Loop.createMarkupLoop(Wprr.sourceProp("files"), fileItem, /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
})), /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}))), /*#__PURE__*/React.createElement(Wprr.AddProps, {
  className: Wprr.sourceReference("externalStorage", "dropHighlightClass")
}, /*#__PURE__*/React.createElement("label", {
  htmlFor: id,
  className: "drop-area drop-area-padding display-block cursor-pointer"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-center small-item-spacing vertically-center-items"
}, /*#__PURE__*/React.createElement(Wprr.Image, {
  className: "icon standard-icon",
  src: "icons/add-circle.svg"
}), /*#__PURE__*/React.createElement("div", {
  className: "drop-area-drop-label"
}, Wprr.idText("Choose a file or drop it here", "site.addOrDropFiles"))))))));
	}
}

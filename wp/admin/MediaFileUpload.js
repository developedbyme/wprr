import React from 'react';
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

//import MediaFileUpload from "wprr/wp/admin/MediaFileUpload";
export default class MediaFileUpload extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["loading"] = false;
	}
	
	_fileUploaded(aId) {
		//console.log("wprr/wp/admin/MediaFileUpload::selectFile");
		//console.log(aId);
		
		this.setState({"loading": false});
		
		let valueName = this.getSourcedProp("valueName");
		let valueController = this.getReference("value/" + valueName);
		if(valueController) {
			valueController.updateValue(valueName, aId);
		}
	}
	
	_uploadFile(aFile) {
		//console.log("wprr/wp/admin/MediaFileUpload::selectFile");
		
		let loader = new Wprr.utils.JsonLoader();
		
		var body = new FormData()
		body.append('file', aFile);
		
		loader.setupPost(this.getReference("wprr/paths/rest") + "wprr/v1/admin/upload-attachment", body);
		
		let userData = this.getReference("wprr/userData");
		if(userData) {
			let nonce = userData.restNonce;
			loader.addHeader("X-WP-Nonce", nonce);
		}
		
		this.setState({"loading": true});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._fileUploaded, [Wprr.source("event", "raw", "data")]));
		
		loader.load();
	}
	
	selectFile(aFile) {
		//console.log("wprr/wp/admin/MediaFileUpload::selectFile");
		//console.log(aFile);
		
		this._uploadFile(aFile);
	}
	
	removeFile(aFile) {
		//console.log("wprr/wp/admin/MediaFileUpload::removeFile");
		
		let valueName = this.getSourcedProp("valueName");
		let valueController = this.getReference("value/" + valueName);
		if(valueController) {
			valueController.updateValue(valueName, null);
		}
	}
	
	_renderMainElement() {
		//console.log("wprr/wp/admin/MediaFileUpload::_renderContentElement");
		
		let valueName = this.getSourcedProp("valueName");
		let mediaId = this.getSourcedPropWithDefault("mediaId", Wprr.sourceProp(valueName));
		
		let inputField = React.createElement(Wprr.FormField, {"type": "file", "changeCommands": [Wprr.commands.callFunction(this, this.selectFile, [Wprr.source("event", "raw", "0")])]})
		let imageField = React.createElement(Wprr.DataLoader, {"loadData": {"postData": "wprr/v1/post/" + mediaId}},
			React.createElement(Wprr.WprrLazyImage, {"data": Wprr.sourceProp("postData", "data.image")})
		);
		
		let injectData = {
			"trigger/selectFile": this,
			"trigger/removeFile": this,
			"elements/media/fileField": inputField,
			"elements/media/image": imageField,
			"elements/media/idField": React.createElement(Wprr.FormField, {"type": "hidden", "name": valueName, "value": mediaId})
		}
		
		//console.log(mediaId);
		
		let section = "loading";
		if(!this.state["loading"]) {
			if(mediaId) {
				section = "file";
			}
			else {
				section = "select";
			}
		}
		
		return React.createElement(Wprr.ReferenceInjection, {"injectData": injectData},
			React.createElement(Wprr.SelectSection, {"selectedSections": section},
				this.props.children
			)
		);
	}
}

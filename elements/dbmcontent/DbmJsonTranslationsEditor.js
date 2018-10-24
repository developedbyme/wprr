import React from "react";
import ReactDOM from 'react-dom';

import WprrBaseObject from "wprr/WprrBaseObject";
import ReferenceInjection from "wprr/reference/ReferenceInjection";

import Loop from "wprr/elements/create/Loop";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";
import FlexRow from "wprr/elements/area/grid/FlexRow";
import MultipleObjectsEditor from "wprr/elements/create/MultipleObjectsEditor";
import SubmitFormEncoder from "wprr/manipulation/adjustfunctions/control/loader/SubmitFormEncoder";
import Control from "wprr/manipulation/Control";
import TriggerUrlRequest from "wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest";
import ChangeDataFunctions from "wprr/wp/admin/ChangeDataFunctions";
import Adjust from "wprr/manipulation/Adjust";
import ValidatingForm from "wprr/elements/form/ValidatingForm";
import TriggerButton from "wprr/elements/interaction/TriggerButton";

// import DbmJsonTranslationsEditor from "wprr/elements/dbmcontent/DbmJsonTranslationsEditor";
export default class DbmJsonTranslationsEditor extends WprrBaseObject {

	constructor(props) {
		super(props);
		
		this._fileIds = new Array();
		this._fileNames = new Array();
		this._decodedFiles = new Array();
		
		this._submitFormEncoder = SubmitFormEncoder.create(this._encodeForm.bind(this));
	}
	
	componentWillMount() {
		let files = this.getSourcedProp("files");
		
		let currentArray = files;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRangeItem = currentArray[i];
			
			let currentId = currentRangeItem["id"];
			let currentObject = {};
			
			let rawData = currentRangeItem["file"];
			if(rawData) {
				try {
					currentObject = JSON.parse(rawData);
				}
				catch(theError) {
					console.error("Could not parse file as json", rawData, this);
					console.error(theError);
				}
			}
			else {
				console.error("No filedata is set", this);
			}
			
			this._fileIds.push(currentId);
			this._fileNames.push(currentRangeItem["title"]);
			this._decodedFiles.push(currentObject);
		}
	}
	
	_encodeForm(aFormData) {
		console.log("wprr/elements/dbmcontent/DbmJsonTranslationsEditor::_encodeForm");
		
		let postChanges = new Array();
		
		let currentArray = this._fileIds;
		let currentArrayLength = currentArray.length;
		for(let  i = 0; i < currentArrayLength; i++) {
			
			let currentData = this._decodedFiles[i];
			
			let changesArray = new Array();
			
			changesArray.push(ChangeDataFunctions.createChangeData("dbm/file/contents", ChangeDataFunctions.createSingleValueData(JSON.stringify(currentData))));
			
			let currenPostData = ChangeDataFunctions.createBatchPostData(currentArray[i], changesArray);
			
			postChanges.push(currenPostData);
		}
		
		return ChangeDataFunctions.createBatchEditData(postChanges);
	}
	
	_getTriggerUrlRequest() {
		console.log("wprr/elements/dbmcontent/DbmJsonTranslationsEditor::_getTriggerUrlRequest");
		let headers = {
			"Content-Type": "application/json"
		};
		let userData = this.getReference("wprr/userData");
		if(userData) {
			let nonce = userData.restNonce;
			headers["X-WP-Nonce"] = nonce;
		}
		
		let triggerUrlRequest = TriggerUrlRequest.create(this.getReference("wprr/paths/rest") + "wprr/v1/admin/batch/edit-posts", "POST", headers);
		
		return triggerUrlRequest;
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/dbmcontent/DbmJsonTranslationsEditor::_renderMainElement");
		
		let titleMarkup = React.createElement("div", {},
			React.createElement(SourcedText, {text: SourceData.create("reference", "loop/item")})
		);
		
		return React.createElement("wrapper", {},
			React.createElement(Control, {adjust: [this._getTriggerUrlRequest()]},
				React.createElement(Control, {adjust: [this._submitFormEncoder]},
					React.createElement(ValidatingForm, {},
						React.createElement(FlexRow, {className: "halfs justify-between"},
							React.createElement(SourcedText, {text: "Text id"}),
							React.createElement(Loop, {input: this._fileNames, loop: MarkupLoop.create(), markup: titleMarkup},
								React.createElement(FlexRow)
							)
						),
						React.createElement(MultipleObjectsEditor, {objects: this._decodedFiles}),
						React.createElement(TriggerButton, {triggerName: "form/submit"},
							React.createElement("div", {}, "Save")
						)
					)
				)
			)
		);
	}

}

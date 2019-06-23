"use strict";

import React from "react";

import Wprr from "wprr/Wprr";
import MultipleRenderObject from "wprr/elements/abstract/MultipleRenderObject";

import objectPath from "object-path";

// import RichTextEditor from "wprr/wp/blocks/editor/RichTextEditor";
export default class RichTextEditor extends MultipleRenderObject {
	
	/**
	 * Constructor
	 */
	constructor(aProps) {
		//console.log("wprr/wp/blocks/editor/RichTextEditor::constructor");
		
		super(aProps);
		
		this.frame = null;
		
		this._addMainElementClassName("rich-text-editor");
	}
	
	getExternalStorage() {
		let externalStorage = this.getFirstValidSource(
			Wprr.sourceProp("externalStorage"),
			Wprr.sourceReferenceIfExists("wprr/wpBlockEditor/externalStorage")
		);
		
		return externalStorage;
	}
	
	_contentChanged(aContent) {
		console.log("wprr/wp/blocks/editor/RichTextEditor::_contentChanged");
		
		let valueName = this.getSourcedProp("valueName");
		this.getExternalStorage().updateValue(valueName, aContent);
	}
	
	_renderPart_main() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		const RichText = wp.editor.RichText;
		
		return React.createElement(
			Wprr.CallbackCommands,
			{
				"callbacks": {
					"onChange": Wprr.commands.callFunction(this, this._contentChanged, [Wprr.source("event", "raw", "0")])
				}
			},
			React.createElement(RichText, {"tagName": "p", "value": value})
		);
	}
	
	
	
	_renderMainElement() {
		//console.log("wprr/wp/blocks/editor/RichTextEditor::_renderMainElement");
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		let mainElement = this.createPartElement("main");
		
		if(!value) {
			let externalStorage = this.getExternalStorage();
			
			mainElement = React.createElement(Wprr.ExternalStorageProps, {"props": valueName, "externalStorage": externalStorage}, mainElement);
		}
		
		return React.createElement("wrapper", {},
			mainElement
		);
	}
}
"use strict";

import React from "react";

import Wprr from "wprr/Wprr";
import MultipleRenderObject from "wprr/elements/abstract/MultipleRenderObject";

import objectPath from "object-path";

// import Link from "wprr/wp/blocks/editor/Link";
export default class Link extends MultipleRenderObject {
	
	/**
	 * Constructor
	 */
	constructor(aProps) {
		//console.log("wprr/wp/blocks/editor/Link::constructor");
		
		super(aProps);
	}
	
	getExternalStorage() {
		let externalStorage = this.getFirstValidSource(
			Wprr.sourceProp("externalStorage"),
			Wprr.sourceReferenceIfExists("wprr/wpBlockEditor/externalStorage")
		);
		
		return externalStorage;
	}
	
	_renderPart_main() {
		
		//METODO: use value instead of relying on the external storage
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		let urlValueName = valueName + ".url";
		let labelValueName = valueName + ".label";
		
		return React.createElement("div", {},
			React.createElement(Wprr.EditableProps, {"editableProps": urlValueName, "externalStorage": this.getExternalStorage()},
				React.createElement(Wprr.FormField, {"className": "full-width", "valueName": urlValueName, "placeholder": Wprr.sourceTranslation("Url")})
			),
			React.createElement(Wprr.EditableProps, {"editableProps": labelValueName, "externalStorage": this.getExternalStorage()},
				React.createElement(Wprr.FormField, {"className": "full-width", "valueName": labelValueName, "placeholder": Wprr.sourceTranslation("Label")})
			)
		);
	}
	
	_renderMainElement() {
		//console.log("wprr/wp/blocks/editor/Link::_renderMainElement");
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		let valueNames = valueName + ".url" + "," + valueName + ".label";
		
		let mainElement = this.createPartElement("main");
		
		if(!value) {
			let externalStorage = this.getExternalStorage();
			
			mainElement = React.createElement(Wprr.ExternalStorageProps, {"props": valueNames, "externalStorage": externalStorage}, mainElement);
		}
		
		return React.createElement("wrapper", {},
			mainElement
		);
	}
}
"use strict";

import React from "react";

import Wprr from "wprr/Wprr";
import MultipleRenderObject from "wprr/elements/abstract/MultipleRenderObject";

import objectPath from "object-path";

// import ImageSelection from "wprr/wp/blocks/editor/ImageSelection";
export default class ImageSelection extends MultipleRenderObject {
	
	/**
	 * Constructor
	 */
	constructor(aProps) {
		//console.log("wprr/wp/blocks/editor/ImageSelection::constructor");
		
		super(aProps);
		
		this.frame = null;
		
		this._callback_imageSelectedBound = this._callback_imageSelected.bind(this);
		
		this._addMainElementClassName("image-selection");
	}
	
	getExternalStorage() {
		let externalStorage = this.getFirstValidSource(
			Wprr.sourceProp("externalStorage"),
			Wprr.sourceReferenceIfExists("wprr/wpBlockEditor/externalStorage")
		);
		
		return externalStorage;
	}
	
	_selectImage() {
		this.frame.open();
	}
	
	_callback_imageSelected() {
		console.log("wprr/wp/blocks/editor/ImageSelection::_callback_imageSelected");
		
		let selectedImages = this.frame.state().get( 'selection' ).toJSON();
		console.log(selectedImages);
		
		let image = {
			"id": objectPath.get(selectedImages, "0.id"),
			"url": objectPath.get(selectedImages, "0.url")
		}
		console.log(image);
		
		let valueName = this.getSourcedProp("valueName");
		this.getExternalStorage().updateValue(valueName, image);
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		this.frame = wp.media({
			"title": this.translate("Choose image"),
			"button": {
				"text": this.translate("Choose"),
			},
			"multiple": false,
			"library": {
				"type": "image"
			}
		});
		
		this.frame.on("select", this._callback_imageSelectedBound);
	}
	
	_renderPart_main() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		return React.createElement(React.Fragment, {},
			React.createElement(Wprr.HasData, {"check": value},
				React.createElement(Wprr.Image, {"className": "image preview-image background-cover", "src": Wprr.sourceProp("image", "url"), "image": value}),
				React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._selectImage)},
					React.createElement("div", {"className": "button"},
						Wprr.translateText("Change image")
					)
				)
			),
			React.createElement(Wprr.HasData, {"check": value, "checkType": "invert/default"},
				React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._selectImage)},
					React.createElement("div", {"className": "button"}, Wprr.translateText("Choose image"))
				)
			),
		);
	}
	
	_renderMainElement() {
		//console.log("wprr/wp/blocks/editor/ImageSelection::_renderMainElement");
		
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
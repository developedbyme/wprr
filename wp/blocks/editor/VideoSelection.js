"use strict";

import React from "react";

import Wprr from "wprr/Wprr";
import MultipleRenderObject from "wprr/elements/abstract/MultipleRenderObject";

import objectPath from "object-path";

// import VideoSelection from "wprr/wp/blocks/editor/VideoSelection";
export default class VideoSelection extends MultipleRenderObject {
	
	/**
	 * Constructor
	 */
	constructor(aProps) {
		//console.log("wprr/wp/blocks/editor/VideoSelection::constructor");
		
		super(aProps);
		
		this.frame = null;
		
		this._callback_imageSelectedBound = this._callback_imageSelected.bind(this);
		
		this.state["undoData"] = null;
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
	
	_removeImage() {
		let valueName = this.getSourcedProp("valueName");
		this.setState({"undoData": this.getExternalStorage().getValue(valueName)});
		this.getExternalStorage().updateValue(valueName, null);
	}
	
	_undoRemoval() {
		let valueName = this.getSourcedProp("valueName");
		this.getExternalStorage().updateValue(valueName, this.state["undoData"]);
	}
	
	_callback_imageSelected() {
		console.log("wprr/wp/blocks/editor/VideoSelection::_callback_imageSelected");
		
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
			"title": this.translate("Choose video"),
			"button": {
				"text": this.translate("Choose"),
			},
			"multiple": false,
			"library": {
				"type": "video"
			}
		});
		
		this.frame.on("select", this._callback_imageSelectedBound);
	}
	
	_renderPart_main() {
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		return React.createElement(React.Fragment, {},
			React.createElement(Wprr.HasData, {"check": value},
				Wprr.text(Wprr.objectPath(value, "url")),
				React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
					React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._selectImage)},
						React.createElement("div", {"className": "button"},
							Wprr.translateText("Change")
						)
					),
					React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._removeImage)},
						React.createElement("div", {"className": "button"},
							Wprr.translateText("Remove")
						)
					)
				)
			),
			React.createElement(Wprr.HasData, {"check": value, "checkType": "invert/default"},
				React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
					React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._selectImage)},
						React.createElement("div", {"className": "button"}, Wprr.translateText("Choose image"))
					),
					React.createElement(Wprr.HasData, {"check": this.state["undoData"]},
						React.createElement(Wprr.CommandButton, {"commands": Wprr.commands.callFunction(this, this._undoRemoval)},
							React.createElement("div", {}, Wprr.translateText("Undo"))
						)
					)
				)
			),
		);
	}
	
	_renderMainElement() {
		//console.log("wprr/wp/blocks/editor/VideoSelection::_renderMainElement");
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getFirstValidSourceIfExists(Wprr.sourceProp("value"), Wprr.sourcePropWithDots(valueName));
		
		let mainElement = this.createPartElement("main");
		
		if(!value) {
			let externalStorage = this.getExternalStorage();
			
			mainElement = React.createElement(Wprr.ExternalStorageProps, {"props": valueName, "externalStorage": externalStorage}, mainElement);
		}
		
		return React.createElement("div", {"className": "image-selection standard-field standard-field-padding"},
			mainElement
		);
	}
}
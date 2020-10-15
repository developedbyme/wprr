import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class RichText extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._externalData = new Wprr.utils.DataStorage();
		this._externalData.updateValue("loaded", false);
	}
	
	_prepareInitialRender() {
		
		super._prepareInitialRender();
		
		let apiKey = this.getFirstInput("apiKey", Wprr.sourceReference("tinymce/apiKey"));
		
		wprr.loadScript("https://cdn.tiny.cloud/1/" + apiKey + "/tinymce/5/tinymce.min.js", Wprr.commands.setValue(this._externalData, "loaded", true));
		
	}
	
	_renderMainElement() {
		
		
		
		return React.createElement(React.Fragment, {},
			React.createElement(Wprr.HasData, {"check": Wprr.sourceStatic(this._externalData, "loaded")},
				React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
					React.createElement(Wprr.RichTextEditor, {valueName: "value"})
				)
			)
		);
	}
}
import Wprr from "wprr/Wprr";
import React from "react";
import { Editor } from '@tinymce/tinymce-react';

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import CommandPerformer from "wprr/commands/CommandPerformer";

// import RichTextEditor from "wprr/elements/form/RichTextEditor";
export default class RichTextEditor extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._editorProperties = null;
		
		this._callback_changeBound = this._callback_change.bind(this);
		this._callback_setupEditorBound = this._callback_setupEditor.bind(this);
	}
	
	_callback_setupEditor(aEditor) {
		console.log("wprr/elements/form/RichTextEditor::_callback_setupEditor");
		
		let commands = this.getFirstInput("setupCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, aEditor, this);
		}
	}
	
	_callback_change(aText) {
		console.log("wprr/elements/form/RichTextEditor::_callback_change");
		console.log(aText);
		//console.log(aEvent.target.value);
		
		let newValue = aText;
		
		this.updateProp("value", aText);
		
		let valueName = this.getFirstInputWithDefault("valueName", "value");
		
		let valueUpdater = this.getReference("value/" + valueName);
		if(valueUpdater) {
			valueUpdater.updateValue(valueName, newValue);
		}
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			CommandPerformer.perform(commands, newValue, this);
		}
	}
	
	getValue() {
		console.log("wprr/elements/form/RichTextEditor::getValue");
		let valueName = this.getFirstInputWithDefault("valueName", "value");
		
		let value = this.getFirstInput("value", Wprr.source("propWithDots", valueName));
		
		console.log(value, this);
		
		return value;
	}
	
	get editorProperties() {
		if(!this._editorProperties) {
			let editorCss = this.getFirstInput("editorCss", Wprr.sourceReferenceIfExists("tinymce/editorCss"));
			let plugins = this.getFirstInputWithDefault("plugins", Wprr.sourceReferenceIfExists("tinymce/plugins"), "link image code autoresize advlist lists");
			let menubar = this.getFirstInputWithDefault("menubar", Wprr.sourceReferenceIfExists("tinymce/menubar"), "");
			let toolbar = this.getFirstInputWithDefault("toolbar", Wprr.sourceReferenceIfExists("tinymce/toolbar"), "undo redo | styleselect | bold italic | link | alignleft aligncenter alignright | numlist bullist | code | fontsizeselect");
		
			this._editorProperties = {
				content_css: editorCss,
				plugins: plugins,
				menubar: menubar,
				toolbar: toolbar,
				relative_urls: false,
				remove_script_host: false,
				setup: this._callback_setupEditorBound
			};
		}
		
		return this._editorProperties;
	}

	_renderMainElement() {
		//console.log("wprr/elements/form/RichTextEditor::_renderMainElement");
		
		let value = this.getValue();
		
		return React.createElement(React.Fragment, {}, React.createElement(Editor, {"init": this.editorProperties, "value": value, onEditorChange: this._callback_changeBound}));
	}

}

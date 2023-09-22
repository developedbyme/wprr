"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import LabelDropFileArea from "./LabelDropFileArea";
export default class LabelDropFileArea extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("LabelDropFileArea::constructor");
		
		super();
		
		this._layoutName = "labelDropFileArea";
		
		this._elementTreeItem.requireValue("dropHighlightClass", "");
	}
	
	_handleFiles(aFiles) {
		console.log("_handleFiles");
		console.log(aFiles);
		
		let commands = this.getSourcedProp("changeCommands");
		
		if(commands) {
			Wprr.utils.CommandPerformer.perform(commands, aFiles, this);
		}
	}
	
	_highlight(aEvent) {
		aEvent.preventDefault()
		aEvent.stopPropagation()
		
		this._elementTreeItem.setValue("dropHighlightClass", "drop-file-highlight");
	}

	_unhighlight(aEvent) {
		aEvent.preventDefault()
		aEvent.stopPropagation()
		
		this._elementTreeItem.setValue("dropHighlightClass", "");
	}

	_handleDrop(aEvent) {
		aEvent.preventDefault()
		aEvent.stopPropagation()
		
		this._elementTreeItem.setValue("dropHighlightClass", "");
		
		let dataTransfer = aEvent.dataTransfer;
		let files = dataTransfer.files;

		this._handleFiles(files);
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "label-drop-file-area"},
			React.createElement(Wprr.EventCommands, {events: { onDragEnter: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]), onDragOver: Wprr.commands.callFunction(this, this._highlight, [Wprr.source("event", "raw")]), onDragLeave: Wprr.commands.callFunction(this, this._unhighlight, [Wprr.source("event", "raw")]),  onDrop: Wprr.commands.callFunction(this, this._handleDrop, [Wprr.source("event", "raw")])}},
				React.createElement(Wprr.Adjust, {adjust: [Wprr.adjusts.resolveSources("htmlFor")], className: this._elementTreeItem.getValueSource("dropHighlightClass"), "htmlFor": aSlots.prop("fieldId", null)},
					aSlots.default(React.createElement("label", {className: "drop-area drop-area-padding display-block cursor-pointer"},
						React.createElement(Wprr.FlexRow, {className: "justify-center small-item-spacing vertically-center-items"},
							React.createElement(Wprr.Image, {className: "icon standard-icon background-contain", src: "icons/add-circle.svg"}),
							React.createElement("div", {className: "drop-area-drop-label"},
								Wprr.idText("Choose a file or drop it here", "site.addOrDropFiles")
							)
						)
					))
				)
			)
		);
	}
}



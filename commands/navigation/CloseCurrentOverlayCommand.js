import React from "react";

import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import CloseCurrentOverlayCommand from "wprr/commands/navigation/CloseCurrentOverlayCommand";
/**
 * Command that closes the current overlay
 */
export default class CloseCurrentOverlayCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("element", SourceData.create("reference", "trigger/closeCurrentOverlay"));
	}
	
	perform() {
		
		let overlayElement = this.getInput("element");
		
		overlayElement.trigger("closeCurrentOverlay", null);
	}
	
	static create(aElement = null) {
		let newCloseCurrentOverlayCommand = new CloseCurrentOverlayCommand();
		
		newCloseCurrentOverlayCommand.setInputWithoutNull("element", aElement);
		
		return newCloseCurrentOverlayCommand;
	}
}

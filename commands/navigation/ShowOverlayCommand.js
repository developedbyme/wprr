import React from "react";

import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";

//import ShowOverlayCommand from "wprr/commands/navigation/ShowOverlayCommand";
/**
 * Command that shows an overlay
 */
export default class ShowOverlayCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("id", "notSet");
		this.setInput("content", React.createElement("div", {}, "[Not set]"));
		this.setInput("element", SourceData.create("reference", "trigger/showOverlay"));
	}
	
	perform() {
		
		let overlayElement = this.getInput("element");
		
		let id = this.getInput("id");
		let content = this.getInput("content");
		
		overlayElement.showOverlay(id, content);
	}
	
	static create(aId = null, aContent = null, aElement = null) {
		let newShowOverlayCommand = new ShowOverlayCommand();
		
		newShowOverlayCommand.setInputWithoutNull("id", aId);
		newShowOverlayCommand.setInputWithoutNull("content", aContent);
		newShowOverlayCommand.setInputWithoutNull("element", aElement);
		
		return newShowOverlayCommand;
	}
}

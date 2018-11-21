import React from "react";
import Wprr from "wprr/Wprr";

import BaseCommand from "wprr/commands/BaseCommand";

import ReferenceInjection from "wprr/reference/ReferenceInjection";

//import InjectReferencesCommand from "wprr/commands/elements/InjectReferencesCommand";
/**
 * Command that add a reference injection around elements.
 */
export default class InjectReferencesCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("injectData", null);
		this.setInput("elements", null);
		
	}
	
	perform() {
		
		let injectData = this.getInput("injectData");
		let elements = this.getInput("elements");
		
		let resolvedInjectData = new Object();
		for(let objectName in injectData) {
			resolvedInjectData[objectName] = this.resolveSource(injectData[objectName]);
		}
		
		return React.createElement(ReferenceInjection, {"injectData": resolvedInjectData}, elements);
	}
	
	static create(aInjectData = null, aElements = null) {
		let newInjectReferencesCommand = new InjectReferencesCommand();
		
		newInjectReferencesCommand.setInputWithoutNull("injectData", aInjectData);
		newInjectReferencesCommand.setInputWithoutNull("elements", aElements);
		
		return newInjectReferencesCommand;
	}
}

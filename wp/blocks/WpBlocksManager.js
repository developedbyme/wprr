import React from "react";
import Wprr from "wprr/Wprr";
import objectPath from "object-path";

import ElementBlockRegistration from "wprr/wp/blocks/registration/ElementBlockRegistration";
import ProgrammingLanguageFunctions from "wprr/wp/ProgrammingLanguageFunctions";

// import WpBlocksManager from "wprr/wp/blocks/WpBlocksManager";
export default class WpBlocksManager {
	
	constructor() {
		//console.log("wprr/wp/blocks/WpBlocksManager::constructor");
		
		this._blockRegistrations = new Object();
		this._prefix = "not-set";
	}
	
	setPrefix(aPrefix) {
		this._prefix = aPrefix;
	}
	
	addBlockRegistration(aName, aRegistrationObject) {
		this._blockRegistrations[aName] = aRegistrationObject;
		
		return this;
	}
	
	registerBlocksFromModule(aBlocks, aIcon = "marker", aCategory = "common") {
		let mappedBlocks = Wprr.utils.array.getPathsInObject(aBlocks);
		let currentArray = mappedBlocks;
		let currentArrayLength = currentArray.length;
	
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			this.createElementBlockRegistration(React.createElement(currentObject.value, {}), currentObject.key, aIcon = "marker", aCategory = "common");
		}
		
		return this;
	}
	
	createElementBlockRegistration(aElement, aName, aIcon = "marker", aCategory = "common") {
		
		let newElementBlockRegistration = new ElementBlockRegistration();
		
		newElementBlockRegistration.setupRegistration(aName, aIcon, aCategory);
		newElementBlockRegistration.setElement(aElement);
		
		let camelCaseId = ProgrammingLanguageFunctions.convertToCamelCase(aName);
		let slugId = ProgrammingLanguageFunctions.convertToWpSlug(aName);
		
		newElementBlockRegistration.setComponent(camelCaseId);
		
		this.addBlockRegistration(this._prefix + "/" + slugId, newElementBlockRegistration);
		
		return newElementBlockRegistration;
	}
	
	registerBlocks() {
		if(wp && wp.blocks) {
			for(let objectName in this._blockRegistrations) {
				wp.blocks.registerBlockType(objectName, this._blockRegistrations[objectName].getRegistrationData());
			}
		}
		else {
			console.error("No wp.blocks. Can't register blocks");
		}
	}
}
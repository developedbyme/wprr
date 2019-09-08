import React from "react";
import Wprr from "wprr/Wprr";
import objectPath from "object-path";

import ElementBlockRegistration from "wprr/wp/blocks/registration/ElementBlockRegistration";
import ElementPluginRegistration from "wprr/wp/blocks/registration/ElementPluginRegistration";
import ProgrammingLanguageFunctions from "wprr/wp/ProgrammingLanguageFunctions";

// import WpBlocksManager from "wprr/wp/blocks/WpBlocksManager";
export default class WpBlocksManager {
	
	constructor() {
		//console.log("wprr/wp/blocks/WpBlocksManager::constructor");
		
		this._blockRegistrations = new Object();
		this._pluginRegistrations = new Object();
		this._prefix = "not-set";
	}
	
	setPrefix(aPrefix) {
		this._prefix = aPrefix;
	}
	
	addBlockRegistration(aName, aRegistrationObject) {
		this._blockRegistrations[aName] = aRegistrationObject;
		
		return this;
	}
	
	addPluginRegistration(aName, aRegistrationObject) {
		this._pluginRegistrations[aName] = aRegistrationObject;
		
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
	
	createElementPluginRegistration(aElement, aName, aIcon = "admin-generic") {
		let newElementPluginRegistration = new ElementPluginRegistration();
		
		let slugId = this._prefix + "-" + ProgrammingLanguageFunctions.convertToWpSlug(aName);
		console.log(">>>>>>", slugId);
		
		newElementPluginRegistration.setupRegistration(slugId, aName, aIcon);
		newElementPluginRegistration.setElement(aElement);
		this.addPluginRegistration(slugId, newElementPluginRegistration);
		
		return newElementPluginRegistration;
	}
	
	registerBlocks() {
		let blocks = objectPath.get(wp, "blocks");
		
		if(blocks) {
			for(let objectName in this._blockRegistrations) {
				blocks.registerBlockType(objectName, this._blockRegistrations[objectName].getRegistrationData());
			}
		}
		else {
			console.error("No wp.blocks. Can't register blocks");
		}
		
		return this;
	}
	
	registerPlugins() {
		
		let plugins = objectPath.get(wp, "plugins");
		
		if(plugins) {
			for(let objectName in this._pluginRegistrations) {
				plugins.registerPlugin(objectName, this._pluginRegistrations[objectName].getRegistrationData());
			}
		}
		else {
			console.error("No wp.plugins. Can't register plugins");
		}
		
		return this;
	}
	
	registerAll() {
		this.registerBlocks();
		this.registerPlugins();
		
		return this;
	}
}
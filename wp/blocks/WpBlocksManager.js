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
	
	registerBlocksFromModule(aBlocks, aIcon = "marker", aCategory = "auto") {
		let mappedBlocks = Wprr.utils.array.getPathsInObject(aBlocks);
		let currentArray = mappedBlocks;
		let currentArrayLength = currentArray.length;
	
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			
			this.createElementBlockRegistration(React.createElement(currentObject.value, {}), currentObject.key, aIcon, aCategory);
		}
		
		return this;
	}
	
	registerBlocksFromClientModule(aBlocks, aIcon = "marker", aCategory = "auto") {
		//console.log("registerBlocksFromClientModule");
		let mappedBlocks = Wprr.utils.array.getPathsInObject(aBlocks);
		let currentArray = mappedBlocks;
		let currentArrayLength = currentArray.length;
	
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			
			let currentClass = currentObject.value;
			//console.log(currentObject);
			
			let element = null;
			if(currentClass.getWpAdminEditor) {
				element = currentClass.getWpAdminEditor();
				if(!element) {
					console.warn("Class has getWpAdminEditor function, but didn't return any element");
				}
			}
			
			if(!element) {
				element = React.createElement(Wprr.layout.admin.WpBlockEditor, {}); //METODO: better editor
			}
			
			let preview = React.createElement(currentClass, {});
			
			this.createElementBlockRegistration(element, currentObject.key, aIcon, aCategory, preview);
		}
		
		return this;
	}
	
	getBlockRegistration(aName) {
		let returnObject = this._blockRegistrations[aName];
		
		if(!returnObject) {
			console.error("No block named " + aName + " exists", this);
			return null;
		}
		
		return returnObject;
	}
	
	createElementBlockRegistration(aElement, aName, aIcon = "marker", aCategory = "auto", aPreview = null) {
		
		let newElementBlockRegistration = new ElementBlockRegistration();
		
		
		let tempArray = aName.split("/");
		let name = tempArray.pop();
		let editorName = name;
		let path = "";
		if(tempArray.length > 0) {
			path = tempArray.join("/");
			name += " (" + path + ")";
			
			if(aCategory === "auto") {
				aCategory = path;
				
				let categories = wp.blocks.getCategories();
				
				if(!Wprr.utils.array.getItemBy("slug", path, categories)) {
					categories.push({"slug": aCategory, "title": aCategory, "icon": null});
					wp.blocks.setCategories(categories);
				}
			}
		}
		
		let elementWithInjection = React.createElement(Wprr.ReferenceInjection, {"injectData": {"editorName": editorName, "editorPath": path, "editorPreview": aPreview}}, aElement);
		
		if(aCategory === "auto") {
			aCategory = "common";
		}
		
		newElementBlockRegistration.setupRegistration(name, aIcon, aCategory);
		newElementBlockRegistration.setElement(elementWithInjection);
		
		let camelCaseId = ProgrammingLanguageFunctions.convertToCamelCase(aName);
		let slugId = ProgrammingLanguageFunctions.convertToWpSlug(aName);
		
		newElementBlockRegistration.setComponent(camelCaseId);
		
		//console.log(this._prefix, slugId);
		this.addBlockRegistration(this._prefix + "/" + slugId, newElementBlockRegistration);
		
		return newElementBlockRegistration;
	}
	
	createElementPluginRegistration(aElement, aName, aIcon = "admin-generic") {
		let newElementPluginRegistration = new ElementPluginRegistration();
		
		let slugId = this._prefix + "-" + ProgrammingLanguageFunctions.convertToWpSlug(aName);
		
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
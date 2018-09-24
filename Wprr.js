import React from "react";

import objectPath from "object-path";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import SourcedText from "wprr/elements/text/SourcedText";

import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";
import PageModuleWithRendererCreator from "wprr/modulecreators/PageModuleWithRendererCreator";
import AppModuleCreator from "wprr/modulecreators/AppModuleCreator";
import AppModuleWithRenderCreator from "wprr/modulecreators/AppModuleWithRenderCreator";

//import Wprr from "wprr";
export default class Wprr {
	
	constructor() {
		this._moduleCreators = new Object();
	}
	
	addGlobalReference(aGlobalObject) {
		aGlobalObject["wprr"] = this;
		
		return this;
	}
	
	addModuleCreator(aName, aModuleCreator) {
		this._moduleCreators[aName] = aModuleCreator;
	}
	
	addPageModule(aName, aModule) {
		let newModuleCreator = PageModuleCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	addPageModuleWithRenderer(aName, aModule) {
		let newModuleCreator = PageModuleWithRendererCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	addAppModule(aName, aModule) {
		let newModuleCreator = AppModuleCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	addAppWithRendererModule(aName, aModule) {
		let newModuleCreator = AppModuleWithRenderCreator.create(aModule);
		this._moduleCreators[aName] = newModuleCreator;
		
		return newModuleCreator;
	}
	
	insertModule(aName, aHolderElement, aData, aLocalData) {
		let currentModuleCreator = this._moduleCreators[aName];
		if(currentModuleCreator) {
			currentModuleCreator.createModule(aHolderElement, aData, aLocalData);
		}
		else {
			console.error("No module named " + aName, this);
		}
	}
	
	static addClass(aName, aClass) {
		Wprr[aName] = aClass;
	}
	
	static addAutonamedClasses(...aClasses) {
		let currentArray = aClasses;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentClass = currentArray[i];
			Wprr.addClass(currentClass.name, currentClass);
		}
	}
	
	static addCommand(aName, aCreateFunction) {
		Wprr.commands[aName] = aCreateFunction;
	}
	
	static addCreator(aName, aCreateFunction) {
		Wprr.creators[aName] = aCreateFunction;
	}
	
	static addUtil(aName, aObject) {
		Wprr.utils[aName] = aObject;
	}
	
	static addAdjust(aName, aCreateFunction) {
		Wprr.adjusts[aName] = aCreateFunction;
	}
	
	static source(aType, aData, aDeepPath = null) {
		if(aDeepPath !== null) {
			return SourceDataWithPath.create(aType, aData, aDeepPath);
		}
		return SourceData.create(aType, aData);
	}
	
	static sourceReference(aPath, aDeepPath = null) {
		return Wprr.source("reference", aPath, aDeepPath);
	}
	
	static sourceProp(aPath, aDeepPath = null) {
		return Wprr.source("prop", aPath, aDeepPath);
	}
	
	static sourceText(aPath) {
		return Wprr.source("text", aPath);
	}
	
	static text(aText, aFormat = "text") {
		return React.createElement(SourcedText, {"text": aText, "format": aFormat});
	}
}

Wprr.commands = new Object();
Wprr.creators = new Object();
Wprr.utils = new Object();
Wprr.adjusts = new Object();
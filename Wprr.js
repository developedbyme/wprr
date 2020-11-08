import React from "react";

import objectPath from "object-path";

import WprrBaseObject from "wprr/WprrBaseObject";

import SourceData from "wprr/reference/SourceData";
import ValueSourceData from "wprr/reference/ValueSourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";

import SourcedText from "wprr/elements/text/SourcedText";
import TranslationOrId from "wprr/elements/text/TranslationOrId";
import Project from "wprr/utils/project/Project";

import PageModuleCreator from "wprr/modulecreators/PageModuleCreator";
import PageModuleWithRendererCreator from "wprr/modulecreators/PageModuleWithRendererCreator";
import AppModuleCreator from "wprr/modulecreators/AppModuleCreator";
import AppModuleWithRenderCreator from "wprr/modulecreators/AppModuleWithRenderCreator";

import TWEEN from "@tweenjs/tween.js";

let getPropFromObject = function(aObject, aProp) {
	if(aObject && aObject.props) {
		return aObject.props[aProp];
	}
	return null;
}

//import Wprr from "wprr/Wprr";
export default class Wprr {
	
	constructor() {
		this._moduleCreators = new Object();
		this._projects = new Object();
		this._scripts = new Object();
		
		if(window && window.requestAnimationFrame) {
			function animate(time) {
				window.requestAnimationFrame(animate);
				TWEEN.update(time);
			}

			window.requestAnimationFrame(animate);
		}
		
		this.staticFunctions = Wprr;
	}
	
	addGlobalReference(aGlobalObject) {
		aGlobalObject["wprr"] = this;
		
		return this;
	}
	
	addModuleCreator(aName, aModuleCreator) {
		aModuleCreator.setWprrInstance(this);
		this._moduleCreators[aName] = aModuleCreator;
		
		return this;
	}
	
	addPageModule(aName, aModule) {
		let newModuleCreator = PageModuleCreator.create(aModule);
		this.addModuleCreator(aName, newModuleCreator);
		
		return newModuleCreator;
	}
	
	addPageModuleWithRenderer(aName, aModule) {
		let newModuleCreator = PageModuleWithRendererCreator.create(aModule);
		this.addModuleCreator(aName, newModuleCreator);
		
		return newModuleCreator;
	}
	
	addAppModule(aName, aModule) {
		let newModuleCreator = AppModuleCreator.create(aModule);
		this.addModuleCreator(aName, newModuleCreator);
		
		return newModuleCreator;
	}
	
	addAppWithRendererModule(aName, aModule) {
		let newModuleCreator = AppModuleWithRenderCreator.create(aModule);
		this.addModuleCreator(aName, newModuleCreator);
		
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
	
	hydrateModule(aName, aHolderElement, aData, aLocalData) {
		let currentModuleCreator = this._moduleCreators[aName];
		if(currentModuleCreator) {
			currentModuleCreator.createModule(aHolderElement, aData, aLocalData, "hydrate");
		}
		else {
			console.error("No module named " + aName, this);
		}
	}
	
	getProject(aName) {
		if(!this._projects[aName]) {
			let newProject = new Project();
			newProject.setName(aName);
			this._projects[aName] = newProject;
		}
		
		return this._projects[aName];
	}
	
	static addClass(aName, aClass) {
		Wprr[aName] = aClass;
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
	
	static addQualification(aName, aCreateFunction) {
		Wprr.qualifications[aName] = aCreateFunction;
	}
	
	static addAllItems(aPrefix, aObjects) {
		for(let objectName in aObjects) {
			objectPath.set(Wprr, aPrefix + "." + objectName, aObjects[objectName]);
		}
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
	
	static sourceReferenceIfExists(aPath, aDeepPath = null) {
		return Wprr.source("referenceIfExists", aPath, aDeepPath);
	}
	
	static sourceProp(aPath, aDeepPath = null) {
		return Wprr.source("prop", aPath, aDeepPath);
	}
	
	static sourcePropWithDots(aPath, aDeepPath = null) {
		return Wprr.source("propWithDots", aPath, aDeepPath);
	}
	
	static sourcePropFrom(aObject, aPropName, aDeepPath = null) {
		return Wprr.source("fromObject", Wprr.sourceFunction(null, getPropFromObject, [aObject, aPropName]), aDeepPath);
	}
	
	static sourceText(aPath) {
		return Wprr.source("text", aPath);
	}
	
	static sourceTranslation(aText, aPath = null) {
		let source = Wprr.source("translation", aText);
		if(aPath) {
			return Wprr.sourceFirst(Wprr.sourceFirst(Wprr.sourceText(aPath), source));
		}
		return source
	}
	
	static sourceQueryString(aName) {
		return Wprr.source("queryString", aName);
	}
	
	static sourceRef(aPath) {
		return Wprr.sourceReference("refs/" + aPath);
	}
	
	static sourceFunction(aThisObject, aFunctionOrName, aArguments = null, aDeepPath = null) {
		return Wprr.source("command", Wprr.commands.callFunction(aThisObject, aFunctionOrName, aArguments), aDeepPath);
	}
	
	static sourceStatic(aObject, aDeepPath = null) {
		return Wprr.source("staticSource", aObject, aDeepPath);
	}
	
	static sourceFirst(...aSources) {
		return Wprr.source("firstInput", aSources);
	}
	
	static sourceCombine(...aParts) {
		return Wprr.source("combine", aParts);
	}
	
	static sourceCopy(aValue, aDeepPath = null) {
		return this.sourceFunction(Wprr.utils.object, Wprr.utils.object.copyViaJson, [aValue], aDeepPath);
	}
	
	static sourceEvent(aDeepPath = null) {
		return Wprr.source("event", "raw", aDeepPath);
	}
	
	static sourceValue(aValue) {
		return ValueSourceData.create(aValue);
	}
	
	static sourceFromJson(aObject) {
		
		if(typeof(aObject) !== "object") {
			return aObject;
		}
		
		let type = aObject["type"];
		let path = aObject["path"];
		let deepPath = aObject["deepPath"];
		
		if(type === "combine") {
			let newPathArray = new Array();
			
			let currentArray = path;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentPathPart = currentArray[i];
				
				newPathArray.push(Wprr.sourceFromJson(currentPathPart));
			}
			
			path = newPathArray;
		}
		
		return Wprr.source(type, path, deepPath);
	}
	
	static isSource(aVariable) {
		return (aVariable instanceof SourceData);
	}
	
	static text(aText, aFormat = "text") {
		return React.createElement(SourcedText, {"text": aText, "format": aFormat});
	}
	
	static translateText(aText, aFormat = "text") {
		return React.createElement(SourcedText, {"text": Wprr.sourceTranslation(aText), "format": aFormat});
	}
	
	static idText(aText, aId = null, aFormat = "text") {
		return React.createElement(TranslationOrId, {"id": aId, "defaultText": Wprr.sourceTranslation(aText), "format": aFormat});
	}
	
	static objectPath(aObject, aPath) {
		//console.log("objectPath");
		
		let currentObject = aObject;
		
		aPath += "";
		if(aPath.length === 0) {
			return currentObject;
		}
		
		let currentArray = aPath.split(".");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentPathPart = currentArray[0];
			
			if(currentObject === null || currentObject === undefined) {
				break;
			}
			
			if(currentPathPart === "(every)") {
				currentArray.shift();
				let currentItems = Wprr.utils.array.singleOrArray(currentObject);
				let returnArray = Wprr.utils.array.mapField(currentItems, currentArray.join("."));
				return returnArray;
			}
			else if(currentObject.getValueForPath) {
				return currentObject.getValueForPath(currentArray.join("."));
			}
			else {
				currentArray.shift();
				
				let partAsInt = parseInt(currentPathPart, 10);
				if(partAsInt.toString() === currentPathPart) {
					currentObject = currentObject[partAsInt];
				}
				else {
					currentObject = currentObject[currentPathPart];
				}
			}
		}
		
		return currentObject;
	}
	
	loadScript(aPath, aCommands) {
		if(!this._scripts[aPath]) {
			let newLoader = new Wprr.utils.loading.ScriptLoader();
			newLoader.setUrl(aPath);
			this._scripts[aPath] = newLoader;
		}
		
		let scriptLoader = this._scripts[aPath];
		
		if(scriptLoader.hasCompleted()) {
			scriptLoader.runCommands(aCommands);
		}
		else {
			scriptLoader.addSuccessCommand(aCommands);
			scriptLoader.load();
		}
	}
}

Wprr.commands = new Object();
Wprr.creators = new Object();
Wprr.utils = new Object();
Wprr.adjusts = new Object();
Wprr.qualifications = new Object();

Wprr.settings_enableSourceRegistration = true;
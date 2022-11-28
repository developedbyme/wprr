"use strict";
import Wprr from "wprr/Wprr";

import objectPath from "object-path";
import queryString from "query-string";

import AcfFunctions from "wprr/wp/AcfFunctions";
import ArrayFunctions from "wprr/utils/ArrayFunctions";
import AbstractDataStorage from "wprr/utils/AbstractDataStorage";

import BaseObject from "wprr/core/BaseObject";

// import SourceData from "wprr/reference/SourceData";
export default class SourceData extends BaseObject {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/SourceData::constructor");
		
		super();
		
		this._sourceFunction = SourceData.getSource;
		this._type = null;
		this._path = null;
		this._debug_lastEvaluatedValue = null;
		this._debug = false;
		
		this._additionalInput = null;
		
		this._shouldCleanup = true;
		
		this._owners = new Array();
		this._subscriptions = new Array();
	}
	
	addOwner(aOwner) {
		this._owners.push(aOwner);
		this._addSubscriptionsForOwner(aOwner);
		
		return this;
	}
	
	_addSubscriptionsForOwner(aOwner) {
		let resolvedSource = this._sourceFunction(this._type, this._path, aOwner, aOwner);
		
		if(!objectPath.get(this._additionalInput, "skipSubscriptions")) {
			if(resolvedSource instanceof AbstractDataStorage) {
				let dataStorage = resolvedSource;
				dataStorage.addOwner(this);
				this._subscriptions.push(dataStorage);
			}
		}
	}
	
	removeOwner(aOwner) {
		let index = this._owners.indexOf(aOwner);
		if(index > 0) {
			this._owners.splice(index, 1);
		}
		
		return  this;
	}
	
	_shouldUpdateOwner(aName, aOwner) {
		//console.log("SourceData::_shouldUpdateOwner", aName, this);
		return false;
	}
	
	externalDataChange(aName = null) {
		//console.log("SourceData::externalDataChange", aName);
		
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			if(this._shouldUpdateOwner(aName, currentOwner)) {
				currentOwner.updateForSourceChange();
			}
		}
	}
	
	setup(aType, aPath) {
		
		this._type = aType;
		this._path = aPath;
		
		return this;
	}
	
	setAdditionalInput(aData) {
		//console.log("setAdditionalInput");
		//console.log(aData);
		
		this._additionalInput = aData;
		
		return this;
	}
	
	setSourceFunction(aFunction) {
		this._sourceFunction = aFunction;
		
		return this;
	}
	
	setCleanup(aShouldCleanup) {
		this._shouldCleanup = aShouldCleanup;
		
		return this;
	}
	
	shouldCleanup() {
		return this._shouldCleanup;
	}
	
	getUpdateSource(aFromObject) {
		//console.log("getUpdateSource");
		
		if(this._type === "reference" || this._type === "referenceIfExists") {
			let path = SourceData.getPathForOwner(this._type, this._path, aFromObject, aFromObject);
			let reference = aFromObject.getReferenceIfExists(path);
			if(reference instanceof SourceData) {
				return reference;
			}
		}
		
		return this;
	}
	
	getSource(aFromObject) {
		let returnValue = this._sourceFunction(this._type, this._path, aFromObject, aFromObject);
		
		this._debug_lastEvaluatedValue = returnValue;
		
		if(this._debug) {
			debugger;
		}
		
		return returnValue;
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		//console.log("wprr/reference/SourceData::getSourceInStateChange");
		let returnValue = this._sourceFunction(this._type, this._path, aFromObject, aNewPropsAndState);
		
		this._debug_lastEvaluatedValue = returnValue;
		
		if(this._debug) {
			debugger;
		}
		
		return returnValue;
	}
	
	removeUsedProps(aProps) {
		//METODO: add propWithDots
		
		if(this._type === "prop") {
			let propName = this._path;
			let dotIndex = propName.indexOf(".");
			if(dotIndex !== -1) {
				propName = propName.substring(dotIndex);
			}
			
			let prop = aProps[propName];
			if(prop instanceof SourceData && !prop.shouldCleanup()) {
				return;
			}
			delete aProps[propName];
		}
	}
	
	deeper(aPath) {
		
		if(Array.isArray(aPath)) {
			aPath = Wprr.sourceCombine(aPath);
		}
		
		return Wprr.sourceStatic(this, aPath);
	}
	
	static create(aType, aPath) {
		let newSourceData = new SourceData();
		
		newSourceData.setup(aType, aPath);
		
		return newSourceData;
	}
	
	static createFunction(aFunction, aPath) {
		let newSourceData = new SourceData();
		
		newSourceData.setup("function", aPath);
		newSourceData.setSourceFunction(aFunction);
		
		return newSourceData;
	}
	
	static getPathForOwner(aType, aPath, aFromObject, aPropsAndState) {
		if(aType === "source") {
			return aPath;
		}
		
		if(aPath instanceof SourceData) {
			aPath = aPath.getSourceInStateChange(aFromObject, aPropsAndState);
		}
		
		return aPath;
	}
	
	static getSource(aType, aPath, aFromObject, aPropsAndState) {
		//console.log("wprr/reference/SourceData::getSource");
		//console.log(aFromObject);
		
		const references = (aFromObject && aFromObject.getReferences) ? aFromObject.getReferences() : {};
		
		if(aType === "source") {
			return aPath;
		}
		
		if(aPath instanceof SourceData) {
			aPath = aPath.getSourceInStateChange(aFromObject, aPropsAndState);
		}
		
		switch(aType) {
			case "prop":
				{
					let returnData = objectPath.get(aPropsAndState.props, aPath);
					if(returnData instanceof SourceData) {
						returnData = returnData.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return returnData;
				}
			case "propWithDots":
				{
					let returnData = aPropsAndState.props[aPath];
					if(returnData instanceof SourceData) {
						returnData = returnData.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return returnData;
				}
			case "state":
				{
					let returnData = objectPath.get(aPropsAndState.state, aPath);
					if(returnData instanceof SourceData) {
						returnData = returnData.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return returnData;
				}
			case "acf":
				let dataObject = references.getObject("wprr/postData");
				if(dataObject instanceof SourceData) {
					dataObject = dataObject.getSourceInStateChange(aFromObject, aPropsAndState);
				}
				return dataObject.getAcfData(aPath);
				//METODO: use acfField instead of post data
			case "acfField":
				{
					let acfObject = references.getObject("wprr/postData/acfObject");
					let splittedPath = aPath.split(".");
					let callArray = [acfObject].concat(splittedPath);
					return AcfFunctions.getAcfSubfieldData.apply(AcfFunctions, callArray);
				}
			case "acfRow":
				{
					let rowObject = references.getObject("wprr/postData/acfRow");
					return AcfFunctions.getAcfSubfieldData(rowObject, aPath);
				}
			case "text":
				{
					return references.getObject("wprr/textManager").getText(aPath);
				}
			case "translation":
				{
					let textPath = aPath;
				
					if(textPath instanceof SourceData) {
						textPath = textPath.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return references.getObject("wprr/textManager").translateText(textPath);
				}
			case "postData":
				{
					let dataObject = references.getObject("wprr/postData");
					if(dataObject instanceof SourceData) {
						dataObject = dataObject.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					
					switch(aPath) {
						case "id":
							return dataObject.getId();
						case "rawData":
							return dataObject._data;
						case "title":
							return dataObject.getTitle();
						case "excerpt":
							return dataObject.getExcerpt();
						case "content":
							return dataObject.getContent();
						case "permalink":
							return dataObject.getPermalink();
						case "image":
							return dataObject.getImage();
						case "language":
							return dataObject.getDataValue("language");
						default:
							console.error("Unknown postData type " + aPath);
							break;
					}
					break;
				}
			case "postMeta":
				let postMeta = references.getObject("wprr/postData/meta");
				return objectPath.get(postMeta, aPath);
			case "rangeItem":
				{
					let dataObject = references.getObject("wprr/rangeData");
					switch(aPath) {
						case "rawData":
							return dataObject;
					}
					return objectPath.get(dataObject, aPath);
				}
			case "userData":
				{
					let dataObject = references.getObject("wprr/userData");
					switch(aPath) {
						case "rawData":
							return dataObject;
					}
					return objectPath.get(dataObject, aPath);
				}
			case "reference":
				{
					let reference = references.getObject(aPath);
					if(reference instanceof SourceData) {
						reference = reference.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return reference;
				}
			case "referenceIfExists":
				{
					if(aPath instanceof SourceData) {
						aPath = aPath.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					
					let reference = references.getObjectIfExists(aPath);
					if(reference instanceof SourceData) {
						reference = reference.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return reference;
				}
			case "combine":
				{
					let returnString = "";
					
					let currentArray = aPath;
					let currentArrayLength = currentArray.length;
					for(let i = 0; i < currentArrayLength; i++) {
						let currentItem = currentArray[i];
						if(currentItem instanceof SourceData) {
							returnString += currentItem.getSourceInStateChange(aFromObject, aPropsAndState);
						}
						else {
							returnString += currentItem;
						}
					}
					
					return returnString;
				}
			case "event":
				return aPropsAndState.event;
			case "object":
				{
					let returnObject = new Object();
					for(let objectName in aPath) {
						let currentItem = aPath[objectName];
						if(currentItem instanceof SourceData) {
							returnObject[objectName] = currentItem.getSourceInStateChange(aFromObject, aPropsAndState);
						}
						else {
							returnObject[objectName] = currentItem;
						}
					}
					return returnObject;
				}
			case "array":
				{
					let returnArray = new Array();
					let currentArray = aPath;
					if(currentArray instanceof SourceData) {
						currentArray = currentArray.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					let currentArrayLength = currentArray.length;
					for(let i = 0; i < currentArrayLength; i++) {
						let currentItem = currentArray[i];
						if(currentItem instanceof SourceData) {
							returnArray.push(currentItem.getSourceInStateChange(aFromObject, aPropsAndState));
						}
						else {
							returnArray.push(currentItem);
						}
					}
					return returnArray;
				}
			case "staticSource":
				return aPath;
			case "fromObject":
				{
					let returnData = aPath;
					if(returnData instanceof SourceData) {
						returnData = returnData.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return returnData;
				}
			case "command":
				{
					let command = aPath;
					command.setTriggerElement(aFromObject);
					command.setEventData(objectPath.get(aPropsAndState, "event"));
					command.setInputData(objectPath.get(aPropsAndState, "input"));
					return command.perform();
				}
			case "commandElement":
				return aFromObject;
			case "firstInput":
				{
					let currentArray = ArrayFunctions.arrayOrSeparatedString(aPath);
					let currentArrayLength = currentArray.length;
					for(let i = 0; i < currentArrayLength; i++) {
						let currentInput = currentArray[i];
						let resolvedValue = null;
						
						if(typeof(currentInput) === 'string') {
							resolvedValue = SourceData.getSource("prop", currentInput, aFromObject, aPropsAndState);
						}
						else if(currentInput instanceof SourceData) {
							resolvedValue = currentInput.getSourceInStateChange(aFromObject, aPropsAndState);
						}
						else {
							resolvedValue = currentInput;
						}
						
						if(resolvedValue !== null && resolvedValue !== undefined) {
							return resolvedValue;
						}
					}
					
					return null;
				}
			case "queryString":
				{
					let parsedQueryString = queryString.parse(location.search);
					return objectPath.get(parsedQueryString, aPath);
				}
			case "input":
				{
					let input = objectPath.get(aPropsAndState, "input");
					if(!input || !input.getInput) {
						console.error("No input available", aPropsAndState);
						return undefined;
					}
					let returnValue = aPropsAndState.input.getInput(aPath, objectPath.get(aPropsAndState, "props"), aFromObject);
					return returnValue;
				}
			default:
				console.error("Unknown type " + aType);
				break;
		}
		
		return null;
	}
	
	static getSourceWithType(aPrefixedPath, aFromObject) {
		if(!aPrefixedPath) {
			console.error("Path is not set");
			//console.log(aFromObject);
			
			return null;
		}
		
		let type = "prop";
		let path = aPrefixedPath;
		let colonIndex = path.indexOf(":");
		
		if(colonIndex !== -1) {
			type = path.substring(0, colonIndex);
			path = path.substring(colonIndex+1, path.length);
		}
		
		return SourceData.getSource(type, path, aFromObject, aFromObject);
	}
}
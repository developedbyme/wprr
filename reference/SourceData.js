"use strict";

import objectPath from "object-path";

import AcfFunctions from "wprr/wp/AcfFunctions";
import ArrayFunctions from "wprr/utils/ArrayFunctions";

// import SourceData from "wprr/reference/SourceData";
export default class SourceData {
	
	/**
	 * Constructor
	 */
	constructor() {
		//console.log("wprr/reference/SourceData::constructor");
		
		this._sourceFunction = SourceData.getSource;
		this._type = null;
		this._path = null;
		this._debug_lastEvaluatedValue = null;
		
		this._shouldCleanup = true;
	}
	
	setup(aType, aPath) {
		
		this._type = aType;
		this._path = aPath;
		
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
	
	getSource(aFromObject) {
		let returnValue = this._sourceFunction(this._type, this._path, aFromObject, aFromObject);
		
		this._debug_lastEvaluatedValue = returnValue;
		
		return returnValue;
	}
	
	getSourceInStateChange(aFromObject, aNewPropsAndState) {
		//console.log("wprr/reference/SourceData::getSourceInStateChange");
		let returnValue = this._sourceFunction(this._type, this._path, aFromObject, aNewPropsAndState);
		
		this._debug_lastEvaluatedValue = returnValue;
		
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
	
	static getSource(aType, aPath, aFromObject, aPropsAndState) {
		//console.log("wprr/reference/SourceData::getSource");
		
		const references = aFromObject ? aFromObject.getReferences() : {};
		
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
				return references.getObject("wprr/postData").getAcfData(aPath);
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
					switch(aPath) {
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
					return references.getObject(aPath);
				}
			case "referenceIfExists":
				{
					if(aPath instanceof SourceData) {
						aPath = aPath.getSourceInStateChange(aFromObject, aPropsAndState);
					}
					return references.getObjectIfExists(aPath);
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
			case "command":
				{
					let command = aPath;
					command.setTriggerElement(aFromObject);
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
				
				return returnString;
			default:
				console.error("Unknown type " + aType);
				break;
		}
		
		return null;
	}
	
	static getSourceWithType(aPrefixedPath, aFromObject) {
		if(!aPrefixedPath) {
			console.error("Path is not set");
			console.log(aFromObject);
			
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
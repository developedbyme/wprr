import React from "react";
import Wprr from "wprr/Wprr";
import objectPath from "object-path";

// import BlockContentParser from "wprr/wp/blocks/BlockContentParser";
export default class BlockContentParser {
	
	constructor() {
		
		this._holderElement = null;
		this._element = null;
		this._content = null;
		
		this._contentElements = null;
		this._componentsData = null;
	}
	
	get element() {
		return this._element;
	}
	
	get contentElements() {
		return this._contentElements;
	}
	
	get componentsData() {
		return this._componentsData;
	}
	
	setContent(aContent) {
		this._content = aContent;
		
		return this;
	}
	
	setHolder(aHolder) {
		this._holderElement = aHolder;
		
		return  this;
	}
	
	createElement() {
		//console.log("BlockContentParser::createElement");
		if(!this._element) {
			this._element = this._parseContent();
			this._contentElements = Wprr.utils.array.copy(this._element.children);
			this._componentsData = this._parseComponents();
			if(this._holderElement) {
				this._holderElement.appendChild(this._element);
			}
			this._runScripts();
		}
	}
	
	setupExistingElement(aElement) {
		this._element = aElement;
		this._contentElements = Wprr.utils.array.copy(this._element.children);
		this._componentsData = this._parseComponents();
		if(this._holderElement) {
			this._holderElement.appendChild(this._element);
		}
	}
	
	_parseContent() {
		//console.log("BlockContentParser::_parseContent");
		
		let temporaryElement = document.createElement("div");
		
		temporaryElement.innerHTML = this._content;
		
		return temporaryElement;
	}
	
	_findComponentElements() {
		let elements = this._element.querySelectorAll("*[data-wprr-component]");
		
		let returnArray = Wprr.utils.array.copy(elements);
		let itemsToRemove = new Array();
		
		{
			let currentArray = returnArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentElement = currentArray[i];
			
				for(let j = 0; j < currentArrayLength; j++) {
					if(j === i) {
						continue;
					}
					if(currentElement.contains(currentArray[j])) {
						itemsToRemove.push(currentArray[j]);
					}
				}
			}
		}
		
		returnArray = Wprr.utils.array.removeValues(returnArray, itemsToRemove);
		
		return returnArray;
	}
	
	_parseComponents() {
		//console.log("BlockContentParser::_parseComponents");
		
		let elements = this._findComponentElements();
		
		let returnArray = new Array();
		
		let currentArray = elements;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = this._getComponentData(currentArray[i]);
			returnArray.push(currentData);
		}
		
		return returnArray;
	}
	
	_getComponentData(aElement) {
		
		let returnData = new Object();
		
		let type = aElement.getAttribute("data-wprr-component");
		let data = new Object();
		let dataString = aElement.getAttribute("data-wprr-component-data");
		
		returnData["container"] = aElement;
		returnData["type"] = type;
		
		try {
			if(dataString != null) {
				data = JSON.parse(dataString);
			}
			
			data["innerElements"] = Wprr.utils.array.copy(aElement.children);
			let contentString = aElement.innerHTML;
			data["innerMarkup"] = contentString;
			
			let parsedContent = new BlockContentParser();
			parsedContent.setHolder(this._holderElement);
			parsedContent.setContent(contentString);
			parsedContent.setupExistingElement(aElement);
			data["parsedContent"] = parsedContent;
			
			if(data["innerMarkup"] && data["innerMarkup"] !== "") {
				aElement.innerHTML = "";
			}
		}
		catch(theError) {
			console.error("Error when creating injected component");
			console.log(theError);
			console.log(dataString);
		}
		
		returnData["data"] = data;
		
		return returnData;
	}
	
	_runScripts() {
		let currentArray = this._element.querySelectorAll("script");
		let currentArrayLength = currentArray.length;
		if(currentArrayLength) {
			for(let i = 0; i < currentArrayLength; i++) {
				let currentElement = currentArray[i];
				let currentCode = currentElement.innerHTML;
				
				if(currentCode) {
					window.wprrTemporaryEval = function() {
						try {
							eval.call(window, currentCode);
						}
						catch(theError) {
							console.error("Error while evaluating script in content");
							console.error(theError)
						}
					};
					window.wprrTemporaryEval();
					delete window.wprrTemporaryEval;
				}
			}
		}
	}
	
	static create(aContent, aHolderElement = null) {
		let newBlockContentParser = new BlockContentParser();
		
		newBlockContentParser.setContent(aContent);
		if(aHolderElement) {
			newBlockContentParser.setHolder(aHolderElement);
		}
		newBlockContentParser.createElement();
		
		return newBlockContentParser;
	}
	
	static createInBody(aContent) {
		let holderElement = document.createElement("div");
		holderElement.setAttribute("style", "display: none;");
		document.body.appendChild(holderElement);
		
		return BlockContentParser.create(aContent, holderElement);
	}
}
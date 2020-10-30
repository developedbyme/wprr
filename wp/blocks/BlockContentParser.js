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
	}
	
	get element() {
		return this._element;
	}
	
	get contentElements() {
		return this._contentElements;
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
		if(!this._element) {
			this._element = this._parseContent();
			this._contentElements = this._element.children;
			if(this._holderElement) {
				this._holderElement.appendChild(this._element);
			}
			this._runScripts();
		}
	}
	
	_parseContent() {
		let temporaryElement = document.createElement("div");
		
		temporaryElement.innerHTML = this._content;
		
		return temporaryElement;
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
							eval(currentCode);
						}
						catch(theError) {
							console.error("Error while evealuating script in content");
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
		newBlockContentParser.createElement()
		
		return newBlockContentParser;
	}
	
	static createInBody(aContent) {
		let holderElement = document.createElement("div");
		holderElement.setAttribute("style", "display: none;");
		document.body.appendChild(holderElement);
		
		return BlockContentParser.create(aContent, holderElement);
	}
}
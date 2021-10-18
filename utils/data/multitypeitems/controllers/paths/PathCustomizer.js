import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class PathCustomizer extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.addSingleLink("paths", null);
		this.item.getLinks("replacements");
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("pathCustomizer", this);
		this.setup();
		
		return this;
	}
	
	setupNewReplacements() {
		let replacementsItem = this.item.group.createInternalItem();
		
		let keyValueGenerator = new Wprr.utils.KeyValueGenerator();
		replacementsItem.addType("keyValues", keyValueGenerator);
		
		this.item.getLinks("replacements").addItem(replacementsItem.id);
		
		return this;
	}
	
	addReplacement(aKey, aValue) {
		
		let replacements = Wprr.objectPath(this.item, "replacements.items.(every).keyValues");
		let currentReplacements = replacements[replacements.length-1];
		
		currentReplacements.addKeyValue(aKey, aValue);
		
		return this;
	}
	
	createNewBasedOnThis() {
		let newPathCustomizer = new PathCustomizer();
		
		let item = this.item.group.createInternalItem();
		
		newPathCustomizer.setupForItem(item);
		
		item.addSingleLink("paths", this.item.getType("paths").id);
		
		item.getLinks("replacements").addUniqueItems(this.item.getLinks("replacements").ids);
		
		newPathCustomizer.setupNewReplacements();
		
		item.addSingleLink("basedOn", this.item.id);
		
		return newPathCustomizer;
	}
	
	resolveSourcedData(aData) {
		if(aData instanceof Wprr.SourceData) {
			return aData.getSource(null);
		}
		
		return aData;
	}
	
	_getReplacement(aKeyword, aDynamicReplacements) {
		
		if(aDynamicReplacements[aKeyword]) {
			return aDynamicReplacements[aKeyword];
		}
		
		let replacements = Wprr.objectPath(this.item, "replacements.items.(every).keyValues");
		if(replacements) {
			let currentArray = replacements;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let replacedValue = currentArray[currentArrayLength-i-1].getValueForKeyIfExists(aKeyword);
				console.log("<<<<", replacedValue, aKeyword);
				if(replacedValue) {
					return replacedValue;
				}
			}
			
		}
		
		return null;
	}
	
	_applyReplacements(aPath, aDynamicReplacements) {
		//console.log("PathCustomizer::_applyReplacements");
		
		let returnPath = aPath;
		let keywordsRegExp = new RegExp("\\{([^\\}]+)\\}", "g");
		
		let matches = new Array();
		
		let debugCounter = 0;
		while(true) {
			if(debugCounter++ > 256) {
				console.error("Loop ran for too long");
				break;
			}
			let match = keywordsRegExp.exec(returnPath);
			
			if(match) {
				matches.push(match);
			}
			else {
				break;
			}
		}
		
		let currentArray = matches;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentMatch = currentArray[i][1];
			
			let replaceWith = this._getReplacement(currentMatch, aDynamicReplacements);
			console.log("replaceWith", replaceWith);
			if(replaceWith) {
				returnPath = returnPath.split("{" + currentMatch + "}").join(replaceWith);
			}
		}
		
		return returnPath;
	}
	
	getPath(aPath, aReplacements = {}) {
		let pathController = Wprr.objectPath(this.item, "paths.linkedItem.pathController");
		let selectedPath = pathController.getChild(aPath).getFullPath();
		
		selectedPath = this._applyReplacements(selectedPath, aReplacements);
		
		return selectedPath;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		//console.log("PathController::getValueForPath");
		//console.log(aPath);
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "item":
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		return Wprr.objectPath(this.getPath(firstPart), restParts);
	}
	
	toJSON() {
		return "[PathCustomizer id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newPathCustomizer = new PathCustomizer();
		
		newPathCustomizer.setupForItem(aItem);
		newPathCustomizer.setupNewReplacements();
		
		return newPathCustomizer;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Taxonomy from "./Taxonomy";
export default class Taxonomy extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Taxonomy::prepare");
		
		aItem.requireValue("hasData/taxonomy", false);
		aItem.requireValue("hasData/topLevelTerms", false);
		aItem.getLinks("terms");
		aItem.getLinks("topLevel");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("Taxonomy::setup");
		console.log(aData);
		
		aItem.getLinks("terms").addItems(aData["terms"]);
		aItem.setValue("hasData/taxonomy", true);
		
		return this;
	}
	
	static calculate_termHierarcy(aItem) {
		console.log("Taxonomy::calculate_termHierarcy");
		console.log(aItem);
		
		if(!aItem.getValue("hasData/termHierarcy")) {
			let topLevelItemIds = new Array();
			let currentArray = aItem.getLinks("terms").items;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTerm = currentArray[i];
				let currentPath = currentTerm.id;
				let index = currentPath.lastIndexOf("/");
				if(index === -1) {
					topLevelItemIds.push(currentPath);
				}
				else {
					currentTerm.getType("parent").linkedItem.getLinks("children").addUniqueItem(currentTerm.id);
				}
			}
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTerm = currentArray[i];
				currentTerm.setValue("hasData/termHierarcy", true);
			}
			
			//METODO: add change function
			
			aItem.getLinks("topLevel").addItems(topLevelItemIds);
			aItem.setValue("hasData/termHierarcy", true);
		}
		
		return this;
	}
}
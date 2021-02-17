import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import GetChildTerms from "wprr/utils/data/GetChildTerms";
export default class GetChildTerms extends MultiTypeItemConnection {
	
	constructor() {
		super();
	}
	
	_hasParent(aTerm, aParentId) {
		
		let currentParentId = Wprr.objectPath(aTerm, "parent.id");
		//console.log(currentParentId, aParentId, aTerm);
		
		if(currentParentId === aParentId) {
			return true;
		}
		
		let currentParent = Wprr.objectPath(aTerm, "parent.linkedItem");
		if(currentParent) {
			return this._hasParent(currentParent, aParentId);
		}
		
		return false;
	}
	
	getLinks(aTaxonomy, aPath) {
		//console.log("getLinks");
		//console.log(aTaxonomy, aPath);
		
		let parentItem = Wprr.objectPath(this.item, "group.taxonomy-" + aTaxonomy + ".termBySlugPath." + aPath);
		let currentTerms = Wprr.objectPath(this.item, "terms/" + aTaxonomy + ".items");
		
		if(!currentTerms) {
			return [];
		}
		
		let returnArray = new Array();
		
		let currentArray = currentTerms;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentTerm = currentArray[i];
			if(this._hasParent(currentTerm, parentItem.id)) {
				returnArray.push(currentTerm);
			}
		}
		
		return returnArray;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		
		
		switch(firstPart) {
			case "getLinks":
				let restParts = tempArray.join(".");
				return Wprr.objectPath(this[firstPart], restParts);
		}
		
		let secondPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		return Wprr.objectPath(this.getLinks(firstPart, secondPart), restParts);
	}
}
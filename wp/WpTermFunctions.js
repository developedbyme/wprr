import objectPath from "object-path";

import ArrayFunctions from "wprr/utils/ArrayFunctions";

// import WpTermFunctions from "wprr/wp/WpTermFunctions";
export default class WpTermFunctions {
	
	static getTermIfExistsBy(aField, aIdentifier, aTerms) {
		
		if(aField === "slugPath") {
			return WpTermFunctions.getTermBySlugPath(aIdentifier, aTerms);
		}
		else if(aField === "id") {
			aField = parseInt(aField, 10);
		}
		
		let currentArray = aTerms;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentTerm = currentArray[i];
			if(currentTerm[aField] === aIdentifier) {
				return currentTerm;
			}
		}
		
		return null;
	}
	
	static getTermBy(aField, aIdentifier, aTerms) {
		
		let returnValue = WpTermFunctions.getTermIfExistsBy(aField, aIdentifier, aTerms);
		console.warn("No term with " + aField + " " + aIdentifier + " exists.", aTerms);
		
		return returnValue;
	}
	
	static getTermById(aId, aTerms) {
		return WpTermFunctions.getTermBy("id", aId, aTerms);
	}
	
	static getTermBySlugPath(aPath, aTerms) {
		return WpTermFunctions.getTermFromHierarchTermsBySlugPath(aPath, WpTermFunctions.getHierarchTerms(aTerms));
	}
	
	static getTermPath(aId, aTerms) {
		let returnArray = new Array();
		
		let debugCounter = 0;
		let currentId = aId;
		while(currentId !== 0) {
			if(debugCounter > 100) {
				console.error("While loop ran for too long.", aId, aTerms);
				return [];
			}
			let currentTerm = WpTermFunctions.getTermById(currentId, aTerms);
			if(!currentTerm) {
				console.error("No term with id " + currentId + " from " + aId, aTerms);
				return returnArray;
			}
			returnArray.unshift(currentTerm);
			currentId = currentTerm["parentId"];
		}
		
		return returnArray;
	}
	
	static getHierarchTerms(aTerms) {
		var returnArray = new Array();
		
		var idMap = new Object();
		
		var currentArray = aTerms;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTerm = currentArray[i];
			
			idMap["id" + currentTerm.id] = {"term": currentTerm, "children": []};
		}
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTerm = currentArray[i];
			
			var currentParent = idMap["id" + currentTerm.parentId];
			if(currentParent) {
				currentParent.children.push(idMap["id" + currentTerm.id]);
			}
			else {
				returnArray.push(idMap["id" + currentTerm.id]);
			}
		}
		
		return returnArray;
	}
	
	static getHierarchLevelTermFromSlug(aSlug, aHierarchTerms) {
		//console.log(aSlug, aHierarchTerms);
		
		let currentArray = aHierarchTerms;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentHierarchyTerm = currentArray[i];
			if(currentHierarchyTerm.term.slug === aSlug) {
				return currentHierarchyTerm;
			}
		}
		
		console.warn("Term with slug " + aSlug + " doesn't exist in terms.", aHierarchTerms);
	}
	
	static getTermFromHierarchTermsBySlugPath(aPath, aHierarchTerms) {
		let currentTerms = aHierarchTerms;
		
		let currentArray = aPath.split("/");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentPathPart = currentArray[i];
			let newTerm = WpTermFunctions.getHierarchLevelTermFromSlug(currentPathPart, currentTerms);
			if(!newTerm) {
				console.warn("No term for path " + aPath + " at " + currentPathPart);
				return null;
			}
			if(i === currentArrayLength-1) {
				return newTerm.term;
			}
			currentTerms = newTerm.children;
		}
		
		return currentTerms;
	}
	
	static getSubtreeFromHierarchTerms(aPath, aHierarchTerms) {
		
		let currentTerms = aHierarchTerms;
		
		let currentArray = aPath.split("/");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentPathPart = currentArray[i];
			let newTerm = WpTermFunctions.getHierarchLevelTermFromSlug(currentPathPart, currentTerms);
			if(!newTerm) {
				console.warn("No term for path " + aPath + " at " + currentPathPart);
				return [];
			}
			currentTerms = newTerm.children;
		}
		
		return currentTerms;
	}
	
	static createEditLinkFromId(aId, aTaxonomy, aSiteUrl) {
		return aSiteUrl + "/wp-admin/term.php?taxonomy=" + aTaxonomy + "&tag_ID=" + aId;
	}
	
	static _adjust_getHierarchTermsFromTerms(aManipulationObject, aReturnObject) {
		
		var termProps = ArrayFunctions.arrayOrSeparatedString(aManipulationObject.getSourcedProp("termProps"));
		
		var currentArray = termProps;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			
			var currentData = aManipulationObject.getSourcedProp(currentName);
			
			aReturnObject[currentName] = WpTermFunctions.getHierarchTerms(currentData);
		}
		
		delete aReturnObject["termProps"];
	}
}
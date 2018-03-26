import objectPath from "object-path";

import ArrayFunctions from "oa/utils/ArrayFunctions";

// import WpTermFunctions from "wprr/wp/WpTermFunctions";
export default class WpTermFunctions {
	
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
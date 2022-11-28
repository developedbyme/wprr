import Wprr from "wprr/Wprr";
import objectPath from "object-path";

// import EditPostEncodeFunctions from "wprr/wp/admin/EditPostEncodeFunctions";
export default class EditPostEncodeFunctions {
	
	static createTerms(aTaxonomy, aField = "id", aChangeType = "terms") {
		let path = aChangeType + "." + aTaxonomy + "." + aField;
		
		let currentFunction = objectPath.get(EditPostEncodeFunctions._storedFunctions, path);
		if(!currentFunction) {
			currentFunction = function(aFieldName, aValue, aChangeData) {
				return aChangeData.setTerms(aValue, aTaxonomy, aField, aChangeType);
			}
			objectPath.set(EditPostEncodeFunctions._storedFunctions, path, currentFunction);
		}
		return currentFunction;
	}
	
	static createAddTerms(aTaxonomy, aField = "id") {
		//console.log("wprr/wp/admin/EditPostEncodeFunctions::createAddTerms");
		return EditPostEncodeFunctions.createTerms(aTaxonomy, aField, "addTerms");
	}
	
	static createDbmRelation(aPath) {
		//console.log("wprr/wp/admin/EditPostEncodeFunctions::createAddTerms");
		
		let path = "dbm/relation" + "." + aPath;
		
		let currentFunction = objectPath.get(EditPostEncodeFunctions._storedFunctions, path);
		if(!currentFunction) {
			currentFunction = function(aFieldName, aValue, aChangeData) {
				return aChangeData.createChange("dbm/relation", {"value": aValue, "path": aPath});
			}
			objectPath.set(EditPostEncodeFunctions._storedFunctions, path, currentFunction);
		}
		return currentFunction;
	}
	
	static createAddTermFromOwner(aGroup) {
		
		let path = "dbm/addTermFromOwner" + "." + aGroup;
		
		let currentFunction = objectPath.get(EditPostEncodeFunctions._storedFunctions, aGroup);
		if(!currentFunction) {
			currentFunction = function(aFieldName, aValue, aChangeData) {
				return aChangeData.createChange("dbm/addTermFromOwner", {"value": aValue, "group": aGroup});
			}
			objectPath.set(EditPostEncodeFunctions._storedFunctions, path, currentFunction);
		}
		return currentFunction;
	}
}

EditPostEncodeFunctions._storedFunctions = new Object();
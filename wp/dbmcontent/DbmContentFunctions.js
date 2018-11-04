import React from "react";

// import DbmContentFunctions from "wprr/wp/dbmcontent/DbmContentFunctions";
export default class DbmContentFunctions  {
	
	static getRelations(aPostData, aRelationType) {
		//console.log("wprr/wp/dbmcontent/DbmContentFunctions::getRelations");
		let idsArray = aPostData.getAddOnsData("dbmContent.relations." + aRelationType);
		
		let returnArray = new Array();
		
		if(idsArray) {
			let currentArray = idsArray;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentId = currentArray[i];
				let currentTerm = aPostData.getTermById(currentId, "dbm_relation");
				returnArray.push(currentTerm);
			}
		}
		
		return returnArray;
	}
	
	static getSingleRelation(aPostData, aRelationType) {
		let relations = DbmContentFunctions.getRelations(aPostData, aRelationType);
		if(relations.length > 0) {
			if(relations.length > 1) {
				console.warn("There are more than 1 relations for " + aRelationType + ". Selecting first.", aPostData);
			}
			return relations[0];
		}
		
		console.warn("There are no relations for " + aRelationType + ".", aPostData);
		return null;
	}
	
	static _source_relationSlugs(aType, aPath, aFromObject, aPropsAndState) {
		const references = aFromObject.getReferences();
		let postData = references.getObject("wprr/postData");
		
		let returnArray = new Array();
		
		let termsArray = DbmContentFunctions.getRelations(postData, aPath);
		
		let currentArray = termsArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			returnArray.push(currentArray[i]["slug"]);
		}
		
		return returnArray;
	}
}
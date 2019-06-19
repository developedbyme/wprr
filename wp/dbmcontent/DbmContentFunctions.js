import React from "react";
import Wprr from "wprr/Wprr";

// import DbmContentFunctions from "wprr/wp/dbmcontent/DbmContentFunctions";
export default class DbmContentFunctions  {
	
	static getRelationIds(aPostData, aRelationType) {
		let idsArray = aPostData.getAddOnsData("dbmContent.relations." + aRelationType);
		
		if(!idsArray) {
			return [];
		}
		
		return idsArray;
	}
	
	static getRelations(aPostData, aRelationType) {
		//console.log("wprr/wp/dbmcontent/DbmContentFunctions::getRelations");
		let idsArray = DbmContentFunctions.getRelationIds(aPostData, aRelationType);
		
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
		let idsArray = DbmContentFunctions.getRelationIds(aPostData, aRelationType);
		if(idsArray.length > 0) {
			if(idsArray.length > 1) {
				console.warn("There are more than 1 relations for " + aRelationType + ". Selecting first.", aPostData);
			}
			return aPostData.getTermById(idsArray[0], "dbm_relation");
		}
		
		console.warn("There are no relations for " + aRelationType + ".", aPostData);
		return null;
	}
	
	static hasAnyRelation(aPostData, aRelationType) {
		let idsArray = aPostData.getAddOnsData("dbmContent.relations." + aRelationType);
		
		return idsArray && (idsArray.length > 0);
	}
	
	static hasSpecificRelation(aPostData, aRelationType) {
		
		let tempArray = aRelationType.split("/");
		let specifiedType = tempArray.pop();
		let path = tempArray.join("/");
		
		let termsArray = DbmContentFunctions.getRelations(aPostData, path);
		let selectedTerm = Wprr.utils.array.getItemBy("slug", specifiedType, termsArray);
		
		return selectedTerm ? true : false;
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
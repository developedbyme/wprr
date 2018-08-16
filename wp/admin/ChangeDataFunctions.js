import React from "react";

// import ChangeDataFunctions from "wprr/wp/admin/ChangeDataFunctions";
export default class ChangeDataFunctions  {
	
	static createCreateData(aTitle, aChanges) {
		//console.log("wprr/wp/admin/ChangeDataFunctions::createCreateData");
		
		let returnObject = new Object();
		
		returnObject["title"] = aTitle;
		returnObject["changes"] = aChanges;
		
		return returnObject;
	}
	
	static createSingleValueData(aValue) {
		let returnObject = new Object();
		
		returnObject["value"] = aValue;
		
		return returnObject;
	}
	
	static createTermsData(aTerms, aTaxonomy) {
		let returnObject = new Object();
		
		returnObject["value"] = aTerms;
		returnObject["taxonomy"] = aTaxonomy;
		
		return returnObject;
	}
	
	static createChangeData(aType, aData) {
		let returnObject = new Object();
		
		returnObject["type"] = aType;
		returnObject["data"] = aData;
		
		return returnObject;
	}
	
	static createChangeDataWithSingleValue(aType, aValue) {
		let returnObject = new Object();
		
		returnObject["type"] = aType;
		returnObject["data"] = ChangeDataFunctions.createSingleValueData(aValue);
		
		return returnObject;
	}
}
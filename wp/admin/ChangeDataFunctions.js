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
	
	static createEditData(aChanges) {
		//console.log("wprr/wp/admin/ChangeDataFunctions::createEditData");
		
		let returnObject = new Object();
		
		returnObject["changes"] = aChanges;
		
		return returnObject;
	}
	
	static createSingleValueData(aValue) {
		let returnObject = new Object();
		
		returnObject["value"] = aValue;
		
		return returnObject;
	}
	
	static createTermsData(aTerms, aTaxonomy, aField = "id") {
		let returnObject = new Object();
		
		returnObject["value"] = aTerms;
		returnObject["taxonomy"] = aTaxonomy;
		returnObject["field"] = aField;
		
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
	
	static createFieldData(aField, aValue) {
		let returnObject = new Object();
		
		returnObject["value"] = aValue;
		returnObject["field"] = aField;
		
		return returnObject;
	}
	
	static createAcfData(aField, aValue) {
		return ChangeDataFunctions.createFieldData(aField, aValue);
	}
	
	static createBatchPostData(aId, aChanges) {
		let returnObject = new Object();
		
		returnObject["id"] = aId;
		returnObject["changes"] = aChanges;
		
		return returnObject;
	}
	
	static createBatchEditData(aPostChanges) {
		let returnObject = new Object();
		
		returnObject["batch"] = aPostChanges;
		
		return returnObject;
	}
}
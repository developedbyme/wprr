import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import FieldsStructure from "./FieldsStructure";
export default class FieldsStructure extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("FieldsStructure::prepare");
		
		aItem.requireValue("hasData/fieldsStructure", false);
		aItem.getNamedLinks("fields");
		aItem.requireSingleLink("for");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("FieldsStructure::setup");
		console.log(aItem, aData);
		
		let fields = aItem.getNamedLinks("fields");
		
		let fieldsData = aData["fields"];
		for(let objectName in fieldsData) {
			fields.addItem(objectName, fieldsData[objectName]);
		}
		
		aItem.setValue("hasData/fieldsStructure", true);
		
		aItem.addSingleLink("for", aData["forType"]);
		
		return this;
	}
}
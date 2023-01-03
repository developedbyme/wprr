import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import FieldsTranslations from "./FieldsTranslations";
export default class FieldsTranslations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("FieldsTranslations::prepare");
		
		aItem.requireValue("hasData/fieldsTranslations", false);
		aItem.getNamedLinks("fieldsTranslations");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("FieldsTranslations::setup");
		//console.log(aItem, aData);
		
		let items = aItem.group;
		
		let fields = aItem.getNamedLinks("fieldsTranslations");
		
		let fieldValues = aData["fieldsTranslations"];
		for(let objectName in fieldValues) {
			let fieldValue = fieldValues[objectName];
			if(!fields.hasLinkByName(objectName)) {
				let fieldItem = items.createInternalItem();
				
				fieldItem.setValue("value", fieldValue);
				
				fieldItem.addSingleLink("for", aItem.id);
				
				fields.addItem(objectName, fieldItem.id);
			}
		}
		
		aItem.setValue("hasData/fieldsTranslations", true);
		
		return this;
	}
}
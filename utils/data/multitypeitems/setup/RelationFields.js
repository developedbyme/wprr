import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Relation from "./Relation";
export default class Relation extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Relation::prepare");
		
		//METODO
		
		aItem.requireValue("hasData/relationFields", false);
		
		aItem.requireValue("hasData/fields", false);
		aItem.getNamedLinks("fields");
		aItem.getLinks("fieldsStructures").addItem("fieldsStructure/relation");
		
		aItem.requireValue("startAt", -1);
		aItem.requireValue("endAt", -1);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Relation::setup");
		//console.log(aData);
		
		//METODO
		
		let fields = aItem.getNamedLinks("fields");
		
		let fieldValues = {"startAt": aItem.getValue("startAt"), "endAt": aItem.getValue("endAt")};
		for(let objectName in fieldValues) {
			let fieldValue = fieldValues[objectName];
			if(!fields.hasLinkByName(objectName)) {
				let fieldItem = items.createInternalItem();
				
				fieldItem.setValue("value", fieldValue);
				let fieldValueSource = fieldItem.getType("value");
				fieldValueSource.makeStorable();
				fieldItem.addType("storedValue", fieldValueSource.sources.get("storedValue"));
				fieldItem.addType("changed", fieldValueSource.sources.get("changed"));
				
				fieldItem.addSingleLink("for", aItem.id);
				
				fields.addItem(objectName, fieldItem.id);
			}
			
			let fieldItem = fields.getLink(objectName);
			aItem.getType(objectName).connectSource(fieldItem.getType("storedValue"));
		}
		
		aItem.setValue("hasData/fields", true);
		aItem.setValue("hasData/relationFields", true);
		
		return this;
	}
}
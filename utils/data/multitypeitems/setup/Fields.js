import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Fields from "./Fields";
export default class Fields extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Fields::prepare");
		
		aItem.requireValue("hasData/fields", false);
		aItem.getNamedLinks("fields");
		aItem.getLinks("fieldsStructures");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Fields::setup");
		//console.log(aItem, aData);
		
		let items = aItem.group;
		aItem.getLinks("fieldsStructures").addItems(aData["fieldsStructures"]);
		
		let fields = aItem.getNamedLinks("fields");
		
		let fieldValues = aData["fieldValues"];
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
		}
		
		aItem.setValue("hasData/fields", true);
		
		return this;
	}
}
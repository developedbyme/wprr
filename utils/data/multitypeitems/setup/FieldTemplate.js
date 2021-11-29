import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import FieldTemplate from "./FieldTemplate";
export default class FieldTemplate extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("FieldTemplate::prepare");
		
		aItem.requireValue("hasData/fieldTemplate", false);
		
		aItem.requireValue("name", null);
		aItem.requireSingleLink("type");
		aItem.requireSingleLink("for");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("FieldTemplate::setup");
		console.log(aItem, aData);
		
		aItem.setValue("name", aData["name"]);
		aItem.addSingleLink("type", aData["type"]);
		aItem.addSingleLink("for", aData["forType"]);
		
		aItem.setValue("hasData/fieldTemplate", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import TemplatePosition from "./TemplatePosition";
export default class TemplatePosition extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("TemplatePosition::prepare");
		
		aItem.requireValue("name");
		aItem.requireValue("identifier");
		aItem.requireValue("hasData/templatePosition", false);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("name", aData["name"]);
		aItem.setValue("identifier", aData["identifier"]);
		aItem.setValue("hasData/templatePosition", true);
		
		return this;
	}
}
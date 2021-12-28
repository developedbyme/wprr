import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Type from "./Type";
export default class Type extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Type::prepare");
		
		aItem.requireValue("hasData/type", false);
		aItem.requireValue("identifier", null);
		aItem.requireValue("name", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("identifier", aData["identifier"]);
		aItem.setValue("name", aData["name"]);
		aItem.setValue("hasData/type", true);
		
		return this;
	}
}
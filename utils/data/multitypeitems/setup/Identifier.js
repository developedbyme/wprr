import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Identifier from "./Identifier";
export default class Identifier extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Identifier::prepare");
		
		aItem.requireValue("hasData/identifier", false);
		aItem.requireValue("identifier", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("identifier", aData["identifier"]);
		aItem.setValue("hasData/identifier", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Name from "./Name";
export default class Name extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Name::prepare");
		
		aItem.requireValue("hasData/name", false);
		aItem.requireValue("name", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("name", aData["name"]);
		aItem.setValue("hasData/name", true);
		
		return this;
	}
}
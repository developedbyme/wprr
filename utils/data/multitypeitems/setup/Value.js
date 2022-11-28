import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Value from "./Value";
export default class Value extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Value::prepare");
		
		aItem.requireValue("hasData/value", false);
		aItem.requireValue("value", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("value", aData["value"]);
		aItem.setValue("hasData/value", true);
		
		return this;
	}
}
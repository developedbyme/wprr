import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Trigger from "./Trigger";
export default class Trigger extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Trigger::prepare");
		
		aItem.requireValue("hasData/trigger", false);
		aItem.requireSingleLink("type");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Trigger::setup");
		//console.log(aData);
		
		aItem.addSingleLink("type", aData["type"]);
		aItem.setValue("hasData/trigger", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import CreationType from "./CreationType";
export default class CreationType extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("CreationType::prepare");
		
		aItem.requireValue("hasData/order/creationType", false);
		aItem.requireValue("creationType");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("CreationType::setup");
		//console.log(aData);
		
		aItem.setValue("creationType", aData["creationType"]);
		aItem.setValue("hasData/order/creationType", true);
		
		return this;
	}
}
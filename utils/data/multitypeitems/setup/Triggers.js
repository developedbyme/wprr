import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Triggers from "./Triggers";
export default class Triggers extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Triggers::prepare");
		
		aItem.requireValue("hasData/triggers", false);
		aItem.getLinks("triggers");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("Triggers::setup");
		//console.log(aData);
		
		let group = aItem.group;
		
		aItem.getLinks("triggers").addUniqueItems(aData["triggers"]);
		
		aItem.setValue("hasData/triggers", true);
		
		return this;
	}
}
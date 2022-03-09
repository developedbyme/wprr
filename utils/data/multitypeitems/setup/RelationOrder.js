import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import RelationOrder from "./RelationOrder";
export default class RelationOrder extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("RelationOrder::prepare");
		
		aItem.requireValue("hasData/relationOrder", false);
		aItem.requireValue("forType", null);
		aItem.requireValue("order", []);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("RelationOrder::setup");
		//console.log(aData);
		
		aItem.setValue("forType", aData["forType"]);
		aItem.setValue("order", aData["order"]);
		aItem.setValue("hasData/relationOrder", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Subscription from "./Subscription";
export default class Subscription extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Subscription::prepare");
		
		aItem.requireValue("hasData/order/subscription", false);
		aItem.requireSingleLink("subscription");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Subscription::setup");
		//console.log(aData);
		
		aItem.addSingleLink("subscription", aData["subscription"]);
		aItem.setValue("hasData/order/subscription", true);
		
		return this;
	}
}
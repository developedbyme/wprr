import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import SubscriptionDates from "./SubscriptionDates";
export default class SubscriptionDates extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("SubscriptionDates::prepare");
		
		aItem.requireValue("hasData/subscriptionDates", false);
		aItem.requireValue("startDate", null);
		aItem.requireValue("endDate", null);
		aItem.requireValue("nextPaymentDate", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("startDate", aData["startDate"]);
		aItem.setValue("endDate", aData["endDate"]);
		aItem.setValue("nextPaymentDate", aData["nextPaymentDate"]);
		aItem.setValue("hasData/subscriptionDates", true);
		
		return this;
	}
}
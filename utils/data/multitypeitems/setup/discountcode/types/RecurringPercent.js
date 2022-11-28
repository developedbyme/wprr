import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import RecurringPercent from "./RecurringPercent";
export default class RecurringPercent extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("RecurringPercent::prepare");
		
		aItem.requireValue("hasData/discountCode/recurringPercent", false);
		aItem.requireValue("numberOfPayments");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("numberOfPayments", aData["numberOfPayments"]);
		aItem.setValue("hasData/discountCode/recurringPercent", true);
		
		return this;
	}
}
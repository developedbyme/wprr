import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PaidDate from "./PaidDate";
export default class PaidDate extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PaidDate::prepare");
		
		aItem.requireValue("hasData/order/paidDate", false);
		aItem.requireValue("paidDate");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("PaidDate::setup");
		//console.log(aData);
		
		aItem.setValue("paidDate", aData["paidDate"]);
		aItem.setValue("hasData/order/paidDate", true);
		
		return this;
	}
}
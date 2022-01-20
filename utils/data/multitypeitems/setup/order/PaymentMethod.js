import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PaymentMethod from "./PaymentMethod";
export default class PaymentMethod extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PaymentMethod::prepare");
		
		aItem.requireValue("hasData/order/paymentMethod", false);
		aItem.requireValue("paymentMethod");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("PaymentMethod::setup");
		//console.log(aData);
		
		aItem.setValue("paymentMethod", aData["paymentMethod"]);
		aItem.setValue("hasData/order/paymentMethod", true);
		
		return this;
	}
}
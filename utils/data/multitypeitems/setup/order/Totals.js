import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Totals from "./Totals";
export default class Totals extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Totals::prepare");
		
		aItem.requireValue("hasData/order/totals", false);
		aItem.requireValue("total");
		aItem.requireValue("tax");
		aItem.requireValue("subtotal");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Totals::setup");
		//console.log(aData);
		
		aItem.setValue("total", aData["total"]);
		aItem.setValue("tax", aData["tax"]);
		aItem.setValue("subtotal", aData["subtotal"]);
		aItem.setValue("hasData/order/totals", true);
		
		return this;
	}
}
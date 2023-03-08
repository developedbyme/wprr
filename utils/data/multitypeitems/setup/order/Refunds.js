import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Refunds from "./Refunds";
export default class Refunds extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Refunds::prepare");
		
		aItem.requireValue("hasData/order/refunds", false);
		aItem.getLinks("refunds");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Refunds::setup");
		//console.log(aData);
		
		aItem.getLinks("refunds").setItems(aData["refunds"]);
		aItem.setValue("hasData/order/refunds", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Orders from "./Orders";
export default class Orders extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Orders::prepare");
		
		aItem.requireValue("hasData/subscription/orders", false);
		aItem.getLinks("orders");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Orders::setup");
		//console.log(aData);
		
		aItem.getLinks("orders").setItems(aData["orders"]);
		aItem.setValue("hasData/subscription/orders", true);
		
		return this;
	}
}
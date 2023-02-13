import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Details from "./Details";
export default class Details extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Details::prepare");
		
		aItem.requireValue("hasData/order/details", false);
		aItem.requireValue("billing");
		aItem.requireValue("shipping");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Details::setup");
		//console.log(aData);
		
		aItem.setValue("billing", aData["billing"]);
		aItem.setValue("shipping", aData["shipping"]);
		aItem.setValue("hasData/order/details", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import DiscountCode from "./DiscountCode";
export default class DiscountCode extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("DiscountCode::prepare");
		
		aItem.requireValue("hasData/discountCode", false);
		aItem.requireValue("code");
		aItem.requireValue("amount");
		aItem.requireValue("type");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("code", aData["code"]);
		aItem.setValue("amount", aData["amount"]);
		aItem.setValue("type", aData["type"]);
		aItem.setValue("hasData/discountCode", true);
		
		return this;
	}
}
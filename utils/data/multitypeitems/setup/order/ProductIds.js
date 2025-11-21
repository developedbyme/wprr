import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ProductIds from "./ProductIds";
export default class ProductIds extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ProductIds::prepare");
		
		aItem.requireValue("hasData/order/productIds", false);
		aItem.getLinks("products");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("ProductIds::setup");
		//console.log(aData);
		
		aItem.getLinks("products").setItems(aData["products"]);
		aItem.setValue("hasData/order/productIds", true);
		
		return this;
	}
}
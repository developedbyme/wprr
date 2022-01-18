import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Product from "./Product";
export default class Product extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Product::prepare");
		
		aItem.requireValue("hasData/product", false);
		aItem.requireValue("price", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("price", aData["price"]);
		aItem.setValue("hasData/product", true);
		
		return this;
	}
}
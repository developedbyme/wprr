import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import OrderItems from "./OrderItems";
export default class OrderItems extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("OrderItems::prepare");
		
		aItem.requireValue("hasData/orderItems", false);
		aItem.getLinks("items");
		aItem.getLinks("coupons");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("OrderItems::setup");
		
		console.log(aData);
		
		let group = aItem.group;
		
		
		{
			let items = aItem.getLinks("items");
			let currentArray = aData["items"];
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentData = currentArray[i];
				let currentItem = group.getItem("lineItem" + currentData["id"]);
				
				currentItem.setValue("systemId", currentData["id"]);
				currentItem.setValue("quantity", currentData["quantity"]);
				currentItem.addSingleLink("product", currentData["product"]);
				currentItem.setValue("total", currentData["total"]);
				currentItem.setValue("tax", currentData["tax"]);
				
				items.addItem(currentItem.id);
			}
		}
		
		{
			let coupons = aItem.getLinks("coupons");
			let currentArray = aData["coupons"];
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentData = currentArray[i];
				let currentItem = group.getItem("lineItem" + currentData["id"]);
				
				currentItem.setValue("systemId", currentData["id"]);
				currentItem.setValue("name", currentData["name"]);
				currentItem.setValue("total", currentData["total"]);
				currentItem.setValue("tax", currentData["tax"]);
				
				coupons.addItem(currentItem.id);
			}
		}
		
		aItem.setValue("hasData/orderItems", true);
		
		return this;
	}
}
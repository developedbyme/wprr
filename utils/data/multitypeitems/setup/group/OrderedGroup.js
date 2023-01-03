import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import OrderedGroup from "./OrderedGroup";
export default class OrderedGroup extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("OrderedGroup::prepare");
		
		aItem.requireValue("hasData/orderedGroup", false);
		aItem.getLinks("items");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log(aData);
		
		aItem.getLinks("items").setItems(aData["items"]);
		aItem.setValue("hasData/orderedGroup", true);
		
		return this;
	}
}
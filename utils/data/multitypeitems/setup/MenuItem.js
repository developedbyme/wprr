import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import MenuItem from "./MenuItem";
export default class MenuItem extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("MenuItem::prepare");
		
		aItem.requireValue("hasData/menuItem", false);
		aItem.requireValue("defaultText", null);
		aItem.requireValue("text", null);
		aItem.requireValue("label", null);
		aItem.requireValue("url", null);
		aItem.requireValue("type", null);
		aItem.requireValue("order", null);
		aItem.requireSingleLink("parent");
		aItem.getLinks("children");
		aItem.getLinks("orderedChildren");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("MenuItem::setup");
		//console.log(aItem, aData);
		
		let type = aData["type"];
		
		aItem.setValue("text", aData["text"]);
		aItem.setValue("type", type);
		aItem.setValue("order", aData["order"]);
		
		let parent = aData["parent"];
		
		aItem.addSingleLink("parent", parent);
		if(parent) {
			aItem.getSingleLink("parent").getLinks("children").addUniqueItem(aItem.id);
		}
		
		if(!aItem.hasType("sortedList")) {
			let sortedList = aItem.addNode("sortedList", new Wprr.utils.data.multitypeitems.controllers.list.SortedList());
			sortedList.setItems(aItem.getLinks("children"));
		
			let sortPartItem = sortedList.addFieldSort("order.value");
		
			aItem.getLinks("orderedChildren").input(sortedList.item.getLinks("sorted"));
		}
		
		aItem.setValue("hasData/menuItem", true);
		
		return this;
	}
}
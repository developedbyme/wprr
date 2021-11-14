import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import MenuItem from "./MenuItem";
export default class MenuItem extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("MenuItem::prepare");
		
		aItem.requireValue("hasData/menuItem", false);
		aItem.requireValue("text", null);
		aItem.requireValue("url", null);
		aItem.requireValue("type", null);
		aItem.requireValue("order", null);
		aItem.requireSingleLink("parent");
		aItem.getLinks("children");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("MenuItem::setup");
		console.log(aData);
		
		let type = aData["type"];
		
		aItem.setValue("text", aData["text"]);
		aItem.setValue("type", type);
		aItem.setValue("order", aData["order"]);
		
		if(aData["parent"]) {
			aItem.addSingleLink("parent", aData["parent"]);
			aItem.getType("parent").linkedItem.getLinks("children").addItem(aItem.id);
		}
		
		if(type === "post_type") {
			aItem.addSingleLink("post", aData["post"]);
			
			//METODO: link text and url
		}
		else if(type === "custom") {
			aItem.setValue("url", aData["url"]);
		}
		else if(type === "taxonomy") {
			aItem.addSingleLink("term", aData["term"]);
			
			//METODO: link text and url
		}
		
		aItem.setValue("hasData/menuItem", true);
		
		return this;
	}
}
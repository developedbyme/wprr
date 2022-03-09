import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Tags from "./Tags";
export default class Tags extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Tags::prepare");
		
		aItem.requireValue("hasData/tags", false);
		aItem.getLinks("tags");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Tags::setup");
		//console.log(aData);
		
		let group = aItem.group;
		
		aItem.getLinks("tags").addUniqueItems(aData["tags"]);
		
		aItem.setValue("hasData/tags", true);
		
		return this;
	}
}
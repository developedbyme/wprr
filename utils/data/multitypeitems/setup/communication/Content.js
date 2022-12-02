import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Content from "./Content";
export default class Content extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Content::prepare");
		
		aItem.requireValue("hasData/communicaction/content", false);
		aItem.requireValue("content", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("content", aData["content"]);
		aItem.setValue("hasData/communicaction/content", true);
		
		return this;
	}
}
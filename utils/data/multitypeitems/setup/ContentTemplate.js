import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ContentTemplate from "./ContentTemplate";
export default class ContentTemplate extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("ContentTemplate::prepare");
		
		aItem.requireValue("hasData/contentTemplate", false);
		aItem.requireValue("name", null);
		aItem.requireValue("title", null);
		aItem.requireValue("content", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("name", aData["name"]);
		aItem.setValue("title", aData["title"]);
		aItem.setValue("content", aData["content"]);
		aItem.setValue("hasData/contentTemplate", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PageTemplate from "./PageTemplate";
export default class PageTemplate extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PageTemplate::prepare");
		
		aItem.requireValue("hasData/pageTemplate", false);
		aItem.requireValue("pageTemplate", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("pageTemplate", aData["pageTemplate"]);
		aItem.setValue("hasData/pageTemplate", true);
		
		return this;
	}
}
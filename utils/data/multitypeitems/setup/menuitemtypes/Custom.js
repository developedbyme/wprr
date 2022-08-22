import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Custom from "./Custom";
export default class Custom extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Custom::prepare");
		
		aItem.requireValue("hasData/menuItem/custom", false);
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("Custom::setup");
		console.log(aData);
		
		aItem.setValue("url", aData["url"]);
		
		aItem.setValue("hasData/menuItem/custom", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ShortTitle from "./ShortTitle";
export default class ShortTitle extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ShortTitle::prepare");
		
		aItem.requireValue("hasData/shortTitle", false);
		aItem.requireValue("shortTitle", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("shortTitle", aData["shortTitle"]);
		aItem.setValue("hasData/shortTitle", true);
		
		return this;
	}
}
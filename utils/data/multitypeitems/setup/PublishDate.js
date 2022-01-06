import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PublishDate from "./PublishDate";
export default class PublishDate extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("PublishDate::prepare");
		
		aItem.requireValue("hasData/publishDate", false);
		aItem.requireValue("date", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("date", aData["date"]);
		aItem.setValue("hasData/publishDate", true);
		
		return this;
	}
}
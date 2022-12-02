import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Title from "./Title";
export default class Title extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Title::prepare");
		
		aItem.requireValue("hasData/communicaction/title", false);
		aItem.requireValue("title", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("title", aData["title"]);
		aItem.setValue("hasData/communicaction/title", true);
		
		return this;
	}
}
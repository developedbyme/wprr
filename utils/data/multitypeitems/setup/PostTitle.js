import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostTitle from "./PostTitle";
export default class PostTitle extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PostTitle::prepare");
		
		aItem.requireValue("hasData/postTitle", false);
		aItem.requireValue("title", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("PostTitle::setup");
		//console.log(aItem, aData);
		
		aItem.setValue("title", aData["title"]);
		aItem.setValue("hasData/postTitle", true);
		
		return this;
	}
}
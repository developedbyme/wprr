import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostTitle from "./PostTitle";
export default class PostTitle extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("PostTitle::prepare");
		
		aItem.requireValue("hasData/postContent", false);
		aItem.requireValue("content", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("content", aData["content"]);
		aItem.setValue("hasData/postContent", true);
		
		return this;
	}
}
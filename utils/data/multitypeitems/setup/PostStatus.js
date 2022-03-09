import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostStatus from "./PostStatus";
export default class PostStatus extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PostStatus::prepare");
		
		aItem.requireValue("hasData/postStatus", false);
		aItem.requireValue("postStatus", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("postStatus", aData["postStatus"]);
		aItem.setValue("hasData/postStatus", true);
		
		return this;
	}
}
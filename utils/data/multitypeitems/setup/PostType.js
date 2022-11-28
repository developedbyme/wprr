import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostType from "./PostType";
export default class PostType extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PostType::prepare");
		
		aItem.requireValue("hasData/postType", false);
		aItem.requireValue("postType", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("postType", aData["postType"]);
		aItem.setValue("hasData/postType", true);
		
		return this;
	}
}
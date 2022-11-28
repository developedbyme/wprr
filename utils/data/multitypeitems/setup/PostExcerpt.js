import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostExcerpt from "./PostExcerpt";
export default class PostExcerpt extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PostExcerpt::prepare");
		
		aItem.requireValue("hasData/postExcerpt", false);
		aItem.requireValue("excerpt", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("excerpt", aData["excerpt"]);
		aItem.setValue("hasData/postExcerpt", true);
		
		return this;
	}
}
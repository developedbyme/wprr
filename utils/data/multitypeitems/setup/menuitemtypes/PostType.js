import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostType from "./PostType";
export default class PostType extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("PostType::prepare");
		
		aItem.requireValue("hasData/menuItem/post_type", false);
		aItem.requireSingleLink("post");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("PostType::setup");
		//console.log(aItem, aData);
		
		aItem.addSingleLink("post", aData["post"]);
		
		let post = aItem.getSingleLink("post");
		
		if(post) {
			aItem.getValueSource("defaultText").input(post.getValueSource("title"));
			aItem.getValueSource("url").input(post.getValueSource("permalink"));
		}
		
		
		aItem.setValue("hasData/menuItem/post_type", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import FeaturedImage from "./FeaturedImage";
export default class FeaturedImage extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("FeaturedImage::prepare");
		
		aItem.requireValue("hasData/featuredImage", false);
		aItem.requireSingleLink("image");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("FeaturedImage::setup");
		console.log(aData);
		
		aItem.addSingleLink("image", aData["image"]);
		aItem.setValue("hasData/featuredImage", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ImagesFor from "./ImagesFor";
export default class ImagesFor extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ImagesFor::prepare");
		
		aItem.requireValue("hasData/imagesFor", false);
		aItem.getLinks("images");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("ImagesFor::setup");
		//console.log(aData);
		
		let group = aItem.group;
		
		aItem.getLinks("images").addUniqueItems(aData["images"]);
		
		aItem.setValue("hasData/imagesFor", true);
		
		return this;
	}
}
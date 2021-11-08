import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Image from "./Image";
export default class Image extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Image::prepare");
		
		aItem.requireValue("hasData/image", false);
		if(!aItem.hasType("sizes")) {
			aItem.addType("sizes", null);
		}
		aItem.requireValue("alt", "");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.addType("sizes", aData["sizes"]);
		aItem.setValue("alt", aData["alt"]);
		aItem.setValue("hasData/image", true);
		
		return this;
	}
}
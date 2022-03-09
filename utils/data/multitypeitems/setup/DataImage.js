import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import DataImage from "./DataImage";
export default class DataImage extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("DataImage::prepare");
		
		aItem.requireValue("hasData/dataImage", false);
		aItem.requireValue("url", "");
		aItem.requireValue("title", "");
		aItem.requireValue("description", "");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("url", aData["url"]);
		aItem.setValue("title", aData["title"]);
		aItem.setValue("description", aData["description"]);
		aItem.setValue("hasData/dataImage", true);
		
		return this;
	}
}
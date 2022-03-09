import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import RelatedProducts from "./RelatedProducts";
export default class RelatedProducts extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("RelatedProducts::prepare");
		
		aItem.requireValue("hasData/relatedProducts", false);
		aItem.getLinks("crosssellProducts");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("RelatedProducts::setup");
		console.log(aItem, aData);
		
		aItem.getLinks("crosssellProducts").addUniqueItems(aData["crosssellProducts"]);
		aItem.setValue("hasData/relatedProducts", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PostTerms from "./PostTerms";
export default class PostTerms extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("PostTerms::prepare");
		
		aItem.requireValue("hasData/postTerms", false);
		aItem.getLinks("terms");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		let links = aItem.getLinks("terms");
		
		let terms = aData["terms"];
		for(let objectName in terms) {
			let currentArray = terms[objectName];
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				links.addUniqueItem(currentArray[i]);
			}
		}
		
		aItem.setValue("hasData/postTerms", true);
		
		return this;
	}
}
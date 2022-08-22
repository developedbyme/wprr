import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Permalink from "./Permalink";
export default class Permalink extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Permalink::prepare");
		
		aItem.requireValue("hasData/permalink", false);
		aItem.requireValue("permalink", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("permalink", aData["permalink"]);
		aItem.setValue("hasData/permalink", true);
		
		return this;
	}
}
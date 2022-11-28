import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Description from "./Description";
export default class Description extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Description::prepare");
		
		aItem.requireValue("hasData/description", false);
		aItem.requireValue("description", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("description", aData["description"]);
		aItem.setValue("hasData/description", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Representations from "./Representations";
export default class Representations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Representations::prepare");
		
		aItem.requireValue("hasData/representation/representations", false);
		aItem.getLinks("representations");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Representations::setup");
		//console.log(aData);
		
		aItem.getLinks("representations").setItems(aData["representations"]);
		aItem.setValue("hasData/representation/representations", true);
		
		return this;
	}
}
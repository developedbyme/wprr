import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Representation from "./Representation";
export default class Representation extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Representation::prepare");
		
		aItem.requireValue("hasData/representation/representation", false);
		aItem.requireSingleLink("by");
		aItem.requireSingleLink("of");
		aItem.requireSingleLink("type");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Representation::setup");
		//console.log(aData);
		
		aItem.addSingleLink("by", aData["by"]);
		aItem.addSingleLink("of", aData["of"]);
		aItem.addSingleLink("type", aData["type"]);
		aItem.setValue("hasData/representation/representation", true);
		
		return this;
	}
}
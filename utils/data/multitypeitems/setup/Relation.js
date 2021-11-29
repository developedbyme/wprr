import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Relation from "./Relation";
export default class Relation extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Relation::prepare");
		
		aItem.requireValue("hasData/relation", false);
		aItem.requireValue("startAt", -1);
		aItem.requireValue("endAt", -1);
		aItem.requireSingleLink("from");
		aItem.requireSingleLink("to");
		aItem.requireSingleLink("type");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("Relation::setup");
		console.log(aData);
		
		aItem.setValue("startAt", aData["startAt"]);
		aItem.setValue("endAt", aData["endAt"]);
		aItem.addSingleLink("from", aData["from"]);
		aItem.addSingleLink("to", aData["to"]);
		aItem.addSingleLink("type", aData["type"]);
		aItem.setValue("hasData/relation", true);
		
		return this;
	}
}
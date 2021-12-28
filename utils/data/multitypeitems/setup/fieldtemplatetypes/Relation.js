import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Relation from "./Relation";
export default class Relation extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Relation::prepare");
		
		aItem.requireValue("hasData/fieldTemplate/relation", false);
		aItem.requireSingleLink("relationType");
		aItem.requireSingleLink("subtree");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Relation::setup");
		//console.log(aData);
		
		aItem.addSingleLink("relationType", aData["relationType"]);
		aItem.addSingleLink("subtree", aData["subtree"]);
		aItem.setValue("hasData/fieldTemplate/relation", true);
		
		return this;
	}
}
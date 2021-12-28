import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Relations from "./Relations";
export default class Relations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Relations::prepare");
		
		aItem.requireValue("hasData/relations", false);
		aItem.getLinks("incomingRelations");
		aItem.getLinks("outgoingRelations");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Relations::setup");
		//console.log(aData);
		
		aItem.getLinks("incomingRelations").addItems(Wprr.objectPath(aData, "relations.incoming"));
		aItem.getLinks("outgoingRelations").addItems(Wprr.objectPath(aData, "relations.outgoing"));
		aItem.setValue("hasData/relations", true);
		
		return this;
	}
}
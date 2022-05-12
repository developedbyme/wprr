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
		
		let incomingIds = Wprr.objectPath(aData, "relations.incoming");
		let outgoingIds = Wprr.objectPath(aData, "relations.outgoing");
		
		aItem.getLinks("incomingRelations").addUniqueItems(incomingIds);
		aItem.getLinks("outgoingRelations").addUniqueItems(outgoingIds);
		
		{
			let currentArray = aItem.group.getItems(incomingIds);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentRelation = currentArray[i];
				currentRelation.requireValue("postStatus", "private");
				currentRelation.setValue("hasData/postStatus", true);
			}
		}
		
		{
			let currentArray = aItem.group.getItems(outgoingIds);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentRelation = currentArray[i];
				currentRelation.requireValue("postStatus", "private");
				currentRelation.setValue("hasData/postStatus", true);
			}
		}
		
		aItem.setValue("hasData/relations", true);
		
		return this;
	}
}
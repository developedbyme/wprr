import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Action from "./Action";
export default class Action extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Action::prepare");
		
		aItem.requireValue("hasData/action", false);
		
		aItem.getLinks("incomingRelations");
		aItem.getLinks("from");
		
		aItem.requireSingleLink("type");
		aItem.requireValue("data");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Action::setup");
		//console.log(aData);
		
		let statusRelations = Wprr.objectPath(aData, "statusRelations");
		aItem.getLinks("incomingRelations").addUniqueItems(statusRelations);
		
		let from = Wprr.objectPath(aData, "from");
		aItem.getLinks("from").addUniqueItems(from);
		
		aItem.addSingleLink("type", Wprr.objectPath(aData, "type"));
		aItem.setValue("data", Wprr.objectPath(aData, "data"));
		
		{
			let currentArray = aItem.group.getItems(statusRelations);
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentRelation = currentArray[i];
				currentRelation.requireValue("postStatus", "private");
				currentRelation.setValue("hasData/postStatus", true);
			}
		}
		
		aItem.setValue("hasData/action", true);
		
		return this;
	}
}
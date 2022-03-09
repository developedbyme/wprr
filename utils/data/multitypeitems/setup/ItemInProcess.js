import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ItemInProcess from "./ItemInProcess";
export default class ItemInProcess extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("ItemInProcess::prepare");
		
		aItem.requireValue("hasData/itemInProcess", false);
		aItem.getLinks("processes");
		aItem.getLinks("started");
		aItem.getLinks("completed");
		aItem.getLinks("skipped");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.getLinks("processes").addUniqueItems(aData["processes"]);
		aItem.getLinks("started").addUniqueItems(aData["started"]);
		aItem.getLinks("completed").addUniqueItems(aData["completed"]);
		aItem.getLinks("skipped").addUniqueItems(aData["skipped"]);
		aItem.setValue("hasData/itemInProcess", true);
		
		return this;
	}
}
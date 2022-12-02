import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import TransactionalEmail from "./TransactionalEmail";
export default class TransactionalEmail extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("TransactionalEmail::prepare");
		
		aItem.requireValue("hasData/communicaction/transactionalEmail", false);
		aItem.requireValue("to", null);
		aItem.requireValue("from", null);
		aItem.requireValue("date", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("to", aData["to"]);
		aItem.setValue("from", aData["from"]);
		aItem.setValue("date", aData["date"]);
		aItem.setValue("hasData/communicaction/transactionalEmail", true);
		
		return this;
	}
}
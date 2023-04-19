import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import InternalMessage from "./InternalMessage";
export default class InternalMessage extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("InternalMessage::prepare");
		
		aItem.requireValue("hasData/internalMessage", false);
		aItem.requireSingleLink("user");
		aItem.requireSingleLink("group");
		aItem.requireSingleLink("type");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("InternalMessage::setup");
		//console.log(aItem, aData);
		
		aItem.addSingleLink("user", aData["user"]);
		aItem.addSingleLink("group", aData["group"]);
		aItem.addSingleLink("type", aData["type"]);
		
		aItem.setValue("hasData/internalMessage", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import UserRelation from "./UserRelation";
export default class UserRelation extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("UserRelation::prepare");
		
		aItem.requireValue("hasData/userRelation", false);
		aItem.requireValue("startAt", -1);
		aItem.requireValue("endAt", -1);
		aItem.requireSingleLink("object");
		aItem.requireSingleLink("user");
		aItem.requireSingleLink("type");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("UserRelation::setup");
		//console.log(aData);
		
		aItem.setValue("startAt", aData["startAt"]);
		aItem.setValue("endAt", aData["endAt"]);
		aItem.addSingleLink("object", aData["object"]);
		aItem.addSingleLink("user", aData["user"]);
		aItem.addSingleLink("type", aData["type"]);
		aItem.setValue("hasData/userRelation", true);
		
		return this;
	}
}
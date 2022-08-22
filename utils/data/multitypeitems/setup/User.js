import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import User from "./User";
export default class User extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("User::prepare");
		
		aItem.requireValue("hasData/user", false);
		aItem.requireValue("name", null);
		aItem.requireValue("gravatarHash", null);
		aItem.requireValue("systemId", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("name", aData["name"]);
		aItem.setValue("gravatarHash", aData["gravatarHash"]);
		aItem.setValue("systemId", aData["id"]);
		aItem.setValue("hasData/user", true);
		
		return this;
	}
}
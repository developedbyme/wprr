import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import SignupInvite from "./SignupInvite";
export default class SignupInvite extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("SignupInvite::prepare");
		
		aItem.requireValue("hasData/signupInvite", false);
		aItem.requireValue("data", null);
		aItem.requireSingleLink("for");
		aItem.requireSingleLink("status");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("data", aData["data"]);
		aItem.addSingleLink("for", aData["for"]);
		aItem.addSingleLink("status", aData["status"]);
		aItem.setValue("hasData/signupInvite", true);
		
		return this;
	}
}
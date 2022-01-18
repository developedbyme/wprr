import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import PageSettings from "./PageSettings";
export default class PageSettings extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("PageSettings::prepare");
		
		aItem.requireValue("hasData/pageSettings", false);
		aItem.requireSingleLink("pageSettings");
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log(aData);
		
		aItem.addSingleLink("pageSettings", aData["pageSettings"]);
		aItem.setValue("hasData/pageSettings", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Process from "./Process";
export default class Process extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Process::prepare");
		
		aItem.requireValue("hasData/itemInProcess", false);
		aItem.getLinks("parts");
		aItem.requireValue("name", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Process::setup");
		//console.log(aItem, aData);
		
		aItem.setValue("name", aData["name"]);
		aItem.getLinks("parts").addUniqueItems(aData["parts"]);
		aItem.setValue("hasData/itemInProcess", true);
		
		return this;
	}
}
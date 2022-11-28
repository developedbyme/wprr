import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ProcessPart from "./ProcessPart";
export default class ProcessPart extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ProcessPart::prepare");
		
		aItem.requireValue("hasData/processPart", false);
		aItem.requireValue("name", null);
		aItem.requireValue("identifier", null);
		aItem.requireValue("description", null);
		aItem.requireValue("value", null);
		aItem.requireValue("type", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("name", aData["name"]);
		aItem.setValue("identifier", aData["identifier"]);
		aItem.setValue("description", aData["description"]);
		aItem.setValue("value", aData["value"]);
		aItem.setValue("type", aData["type"]);
		aItem.setValue("hasData/processPart", true);
		
		return this;
	}
}
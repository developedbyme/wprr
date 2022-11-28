import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import SequenceNumber from "./SequenceNumber";
export default class SequenceNumber extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("SequenceNumber::prepare");
		
		aItem.requireValue("hasData/sequenceNumber", false);
		aItem.requireValue("identifier", null);
		aItem.requireValue("number", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("identifier", aData["identifier"]);
		aItem.setValue("number", aData["number"]);
		aItem.setValue("hasData/sequenceNumber", true);
		
		return this;
	}
}
import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import ObjectTypes from "./ObjectTypes";
export default class ObjectTypes extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ObjectTypes::prepare");
		
		aItem.requireValue("hasData/objectTypes", false);
		aItem.getLinks("objectTypes");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("ObjectTypes::setup");
		//console.log(aData);
		
		aItem.getLinks("objectTypes").addItems(Wprr.objectPath(aData, "objectTypes"));
		aItem.setValue("hasData/objectTypes", true);
		
		return this;
	}
}
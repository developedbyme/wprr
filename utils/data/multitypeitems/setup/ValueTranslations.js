import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Value from "./Value";
export default class ValueTranslations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ValueTranslations::prepare");
		
		aItem.requireValue("hasData/value/translations", false);
		aItem.requireValue("translatedValue", null);
		aItem.requireValue("valueTranslations", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("ValueTranslations::setup");
		
		aItem.setValue("translatedValue", aData["value"]);
		aItem.setValue("valueTranslations", aData["valueTranslations"]);
		
		let projectItem = aItem.group.getItem("project");
		
		let getPropertyNode = Wprr.utils.data.nodes.GetProperty.connect(aItem.getValueSource("valueTranslations"), projectItem.getValueSource("language"));
		aItem.addNode("translatedValueGetProperty", getPropertyNode);
		
		let firstNode = Wprr.utils.data.nodes.logic.First.create();
		firstNode.addValues(getPropertyNode.sources.get("value"), aItem.getValueSource("value"));
		aItem.addNode("translatedValueFirst", firstNode);
		
		aItem.getValueSource("translatedValue").input(firstNode.sources.get("output"));
		
		aItem.setValue("hasData/value/translations", true);
		
		return this;
	}
}
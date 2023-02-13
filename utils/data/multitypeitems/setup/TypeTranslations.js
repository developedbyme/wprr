import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import TypeTranslations from "./TypeTranslations";
export default class TypeTranslations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("TypeTranslations::prepare");
		
		aItem.requireValue("hasData/type/translations", false);
		aItem.requireValue("translatedName", null);
		aItem.requireValue("nameTranslations", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("TypeTranslations::setup");
		
		aItem.setValue("translatedName", aData["name"]);
		aItem.setValue("nameTranslations", aData["nameTranslations"]);
		
		let projectItem = aItem.group.getItem("project");
		
		let getPropertyNode = Wprr.utils.data.nodes.GetProperty.connect(aItem.getValueSource("nameTranslations"), projectItem.getValueSource("language"));
		aItem.addNode("translatedNameGetProperty", getPropertyNode);
		
		let firstNode = Wprr.utils.data.nodes.logic.First.create();
		firstNode.addValues(getPropertyNode.sources.get("value"), aItem.getValueSource("name"));
		aItem.addNode("translatedNameFirst", firstNode);
		
		aItem.getValueSource("translatedName").input(firstNode.sources.get("output"));
		
		aItem.setValue("hasData/name/translations", true);
		
		return this;
	}
}
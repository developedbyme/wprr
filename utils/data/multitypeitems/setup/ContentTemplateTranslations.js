import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Value from "./Value";
export default class ContentTemplateTranslations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("ContentTemplateTranslations::prepare");
		
		aItem.requireValue("hasData/contentTemplate/translations", false);
		aItem.requireValue("translatedTitle", null);
		aItem.requireValue("titleTranslations", null);
		aItem.requireValue("translatedContent", null);
		aItem.requireValue("contentTranslations", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		console.log("ContentTemplateTranslations::setup");
		
		aItem.setValue("translatedTitle", aData["title"]);
		aItem.setValue("titleTranslations", aData["titleTranslations"]);
		
		aItem.setValue("translatedContent", aData["content"]);
		aItem.setValue("contentTranslations", aData["contentTranslations"]);
		
		let projectItem = aItem.group.getItem("project");
		
		{
			let getPropertyNode = Wprr.utils.data.nodes.GetProperty.connect(aItem.getValueSource("titleTranslations"), projectItem.getValueSource("language"));
			aItem.addNode("translatedTitleGetProperty", getPropertyNode);
		
			let firstNode = Wprr.utils.data.nodes.logic.First.create();
			firstNode.addValues(getPropertyNode.sources.get("value"), aItem.getValueSource("title"));
			aItem.addNode("translatedTitleFirst", firstNode);
			
			aItem.getValueSource("translatedTitle").input(firstNode.sources.get("output"));
		}
		
		{
			let getPropertyNode = Wprr.utils.data.nodes.GetProperty.connect(aItem.getValueSource("contentTranslations"), projectItem.getValueSource("language"));
			aItem.addNode("translatedContentGetProperty", getPropertyNode);
		
			let firstNode = Wprr.utils.data.nodes.logic.First.create();
			firstNode.addValues(getPropertyNode.sources.get("value"), aItem.getValueSource("content"));
			aItem.addNode("translatedContentFirst", firstNode);
			
			aItem.getValueSource("translatedContent").input(firstNode.sources.get("output"));
		}
		
		
		aItem.setValue("hasData/contentTemplate/translations", true);
		
		console.log(aItem);
		
		return this;
	}
}
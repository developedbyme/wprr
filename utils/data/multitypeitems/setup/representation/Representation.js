import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Representation from "./Representation";
export default class Representation extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Representation::prepare");
		
		aItem.requireValue("hasData/representation/representation", false);
		aItem.requireSingleLink("by");
		aItem.requireSingleLink("of");
		aItem.requireSingleLink("type");
		
		aItem.requireValue("url");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Representation::setup");
		//console.log(aItem, aData);
		
		aItem.addSingleLink("by", aData["by"]);
		aItem.addSingleLink("of", aData["of"]);
		aItem.addSingleLink("type", aData["type"]);
		aItem.setValue("hasData/representation/representation", true);
		
		let textReplacement = aItem.addNode("urlTextReplace", new Wprr.utils.data.nodes.ReplaceText());
		textReplacement.sources.get("text").input(aItem.getValueSource("value"));
		
		let byItem = aItem.getSingleLink("by");
		if(byItem) {
			
			let getTranslatedUrl = aItem.addNode("getTranslatedUrl", new Wprr.utils.data.nodes.GetItemProperty());
			getTranslatedUrl.item.getType("fromItem").idSource.input(byItem.requireSingleLink("translatedPost").idSource);
			getTranslatedUrl.setPropertyPath("valueSource.permalink");
			
			textReplacement.addReplacement("{post}", getTranslatedUrl.item.getValueSource("value"));
		}
		
		textReplacement.addReplacement("{id}", aItem.getType("of").idSource);
		
		aItem.getValueSource("url").input(textReplacement.sources.get("replacedText"));
		
		return this;
	}
}
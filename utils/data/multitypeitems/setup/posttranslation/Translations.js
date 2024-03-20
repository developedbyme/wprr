import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Translations from "./Translations";
export default class Translations extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Translations::prepare");
		
		aItem.requireValue("hasData/posttranslation/translations", false);
		aItem.requireSingleLink("translations");
		
		aItem.requireSingleLink("translatedPost");
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("Translations::setup");
		//console.log(aItem, aData);
		
		aItem.addSingleLink("translations", aData["translations"]);
		aItem.setValue("hasData/posttranslation/translations", true);
		
		let translations = aItem.getSingleLink("translations");
		if(translations) {
			let firstNode = Wprr.utils.data.nodes.logic.First.create();
			firstNode.addValues(aItem.getSingleLink("translations").requireSingleLink("translatedPost").idSource, aItem.id);
			aItem.addNode("translatedPostFirst", firstNode);
		
			aItem.getType("translatedPost").idSource.input(firstNode.sources.get("output"));
		}
		else {
			aItem.addSingleLink("translatedPost", aItem.id)
		}
		
		
		return this;
	}
}
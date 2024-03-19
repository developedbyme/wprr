import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import TranslationsGroup from "./TranslationsGroup";
export default class TranslationsGroup extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("TranslationsGroup::prepare");
		
		aItem.requireValue("hasData/posttranslation/translationsGroup", false);
		aItem.requireSingleLink("of");
		aItem.getLinks("posts");
		
		//METODO: link to current language
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.addSingleLink("of", aData["of"]);
		aItem.getLinks("posts").setItems(aData["posts"]);
		aItem.setValue("hasData/posttranslation/translationsGroup", true);
		
		//METODO: link to current language
		
		return this;
	}
}
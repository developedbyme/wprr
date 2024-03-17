import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Language from "./Language";
export default class Language extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("Language::prepare");
		
		aItem.requireValue("hasData/posttranslation/language", false);
		aItem.requireValue("language", null);
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.setValue("language", aData["language"]);
		aItem.setValue("hasData/posttranslation/language", true);
		
		return this;
	}
}
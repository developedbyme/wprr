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
		
		//METODO: link to current language
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.addSingleLink("translations", aData["translations"]);
		aItem.setValue("hasData/posttranslation/translations", true);
		
		//METODO: link to current language
		
		return this;
	}
}
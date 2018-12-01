import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import AddTranslationMapToTextManager from "wprr/textmanager/AddTranslationMapToTextManager";
export default class AddTranslationMapToTextManager extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/textmanager/AddTranslationMapToTextManager::_removeUsedProps");
		
		delete aReturnObject["texts"];
		delete aReturnObject["path"];
		
		return aReturnObject;
	}
	
	_prepareRender() {
		
		let textManager =  this.getReference("wprr/textManager");
		
		let texts = this.getSourcedProp("texts");
		let path = this.getSourcedPropWithDefault("path", null);
		
		if(path) {
			textManager.addTranslationsToMap(texts, path);
		}
		else {
			textManager.addTranslationsToMap(texts);
		}
		
		super._prepareRender();
	}
}

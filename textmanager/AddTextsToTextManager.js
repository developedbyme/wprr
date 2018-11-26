import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

//import AddTextsToTextManager from "wprr/textmanager/AddTextsToTextManager";
export default class AddTextsToTextManager extends ManipulationBaseObject {

	constructor (props) {
		super(props);
		
	}
	
	_removeUsedProps(aReturnObject) {
		//console.log("wprr/textmanager/AddTextsToTextManager::_removeUsedProps");
		
		delete aReturnObject["texts"];
		delete aReturnObject["path"];
		
		return aReturnObject;
	}
	
	_prepareRender() {
		
		let textManager =  this.getReference("wprr/textManager");
		
		let texts = this.getSourcedProp("texts");
		let path = this.getSourcedPropWithDefault("path", null);
		
		if(path) {
			textManager.addTexts(texts, path);
		}
		else {
			textManager.setData(texts);
		}
		
		super._prepareRender();
	}
}

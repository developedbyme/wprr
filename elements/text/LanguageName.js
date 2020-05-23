import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Adjust from "wprr/manipulation/Adjust";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";

//import LanguageName from "wprr/elements/text/LanguageName";
export default class LanguageName extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		
		super._removeUsedProps(aReturnObject);
		
		delete aReturnObject["languageCode"];
		delete aReturnObject["useTranslatedName"];
		delete aReturnObject["name"];
		delete aReturnObject["translatedName"];
		
		return aReturnObject;
	}
	
	_renderMainElement() {
		
		let languageCode = this.getSourcedProp("languageCode");
		let nameProperty = "name";
		if(this.getSourcedProp("useTranslatedName")) {
			nameProperty = "translatedName";
		}
		
		return React.createElement(WprrDataLoader, {loadData: {"languages": "wprr/v1/global/wpml/languages"}},
			React.createElement(Adjust, {adjust: LanguageName._adjust_selectLanguage, languageCode: languageCode},
				React.createElement(SourcedText, {text: SourceDataWithPath.create("prop", "language", nameProperty)})
			)
		);
	}
	
	static _adjust_selectLanguage(aReturnObject, aManipulationObject) {
		
		let languageCode = aReturnObject["languageCode"];
		
		let currentArray = aReturnObject["languages"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLanguage = currentArray[i];
			if(currentLanguage.code === languageCode) {
				aReturnObject["language"] = currentLanguage;
				break;
			}
		}
		
		delete aReturnObject["languageCode"];
		delete aReturnObject["languages"];
		
		return aReturnObject;
	}
}
import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import AddTextsToTextManager from "wprr/textmanager/AddTextsToTextManager";
import AddTranslationMapToTextManager from "wprr/textmanager/AddTranslationMapToTextManager";

//import TranslationSetup from "wprr/textmanager/TranslationSetup";
export default class TranslationSetup extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
	}
	
	_renderMainElement() {
		
		let baseLanguage = this.getFirstInputWithDefault("baseLanguage", "en");
		let language = this.getFirstInputWithDefault("language", Wprr.sourceReferenceIfExists("wprr/pageData", "queryData.language"), "en");
		let fileName = this.getFirstInputWithDefault("fileName", "texts/{language}.json");
		let path = this.getFirstInput("path", Wprr.sourceReferenceIfExists("wprr/paths/data"), Wprr.sourceReference("wprr/paths/theme"));
		let textPath = this.getFirstInputWithDefault("textPath", null);
		
		let props = this.getProps();
		
		return React.createElement(Wprr.DataLoader, { 
				skipLanguageParameter: true,
				apiFormat: "raw",
				loadData: {
					"baseLanguage": path + "/" + fileName.split("{language}").join(baseLanguage),
					"language": path + "/" + fileName.split("{language}").join(language),
				}
			},
			React.createElement(AddTranslationMapToTextManager, {texts: Wprr.sourceProp("baseLanguage"), path: textPath},
				React.createElement(AddTextsToTextManager, {texts: Wprr.sourceProp("language"), path: textPath},
					React.createElement(Wprr.Adjust, {adjust: Wprr.adjusts.filterProps([])}, props.children)
				)
			)
		);
	}
}

import React from "react";
import objectPath from "object-path";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Loop from "wprr/elements/create/Loop";
import InjectChildren from "wprr/manipulation/InjectChildren";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import Link from "wprr/elements/interaction/Link";
import Image from "wprr/elements/image/Image";
import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";
import Adjust from "wprr/manipulation/Adjust";

//import WpmlLanguageName from "wprr/wp/menu/WpmlLanguageName";
export default class WpmlLanguageName extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		
		delete aReturnObject["translated"];
		delete aReturnObject["outputName"];
		delete aReturnObject["code"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		let outputName = this.getSourcedPropWithDefault("outputName", "output");
		
		if(children.length === 0) {
			outputName = "text";
			children = React.createElement(SourcedText);
		}
		
		let translated = this.getSourcedPropWithDefault("translated", false);
		let nameField = translated ? "translatedName" : "name";
		
		let code = this.getSourcedProp("code");
		if(!code) {
			code = objectPath.get(this.getReference("wprr/pageData"), "queryData.language");
		}
		
		return [React.createElement(WprrDataLoader, {"loadData": {"input": "wprr/v1/global/wpml/languages"}},
			React.createElement(Adjust, {"adjust": WpmlLanguageName._adjust_selectName, "outputName": outputName, "code": code, "nameField": nameField}, children)
		)];
	}
	
	static _adjust_selectName(aProps, aElement) {
		
		let languageName = "";
		
		let code = aProps["code"];
		let outputName = aProps["outputName"];
		
		let isFound = false;
		
		let currentArray = aProps["input"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			if(currentItem["code"] === code) {
				languageName = currentItem[aProps["nameField"]];
				isFound = true;
				break;
			}
		}
		
		if(!isFound) {
			console.warn("No language found for code " + code);
		}
		
		delete aProps["input"];
		delete aProps["code"];
		delete aProps["nameField"];
		delete aProps["outputName"];
		
		aProps[outputName] = languageName;
		
		return aProps;
	}
}

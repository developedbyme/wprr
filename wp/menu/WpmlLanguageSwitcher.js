import React from "react";
import Wprr from "wprr/Wprr";

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

//import WpmlLanguageSwitcher from "wprr/wp/menu/WpmlLanguageSwitcher";
export default class WpmlLanguageSwitcher extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_removeUsedProps(aReturnObject) {
		
		delete aReturnObject["translated"];
		delete aReturnObject["itemSpacingMarkup"];
		delete aReturnObject["itemMarkup"];
		
		return aReturnObject;
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		if(children.length === 0) {
			children = React.createElement(InjectChildren);
		}
		
		let translated = this.getSourcedPropWithDefault("translated", false);
		let nameField = translated ? "translatedName" : "name";
		
		let itemMarkup = React.createElement(Link, {"href": SourceDataWithPath.create("reference", "loop/item", "pageUrl"), "className": SourceData.create("combine", ["language-link", " ", SourceDataWithPath.create("reference", "loop/item", "code")])},
			React.createElement(Image, {"overrideMainElementType": "img", "src": SourceDataWithPath.create("reference", "loop/item", "flagUrl"), "className": "language-flag"}),
			" ",
			React.createElement("span", {"className": "language-name"},
				React.createElement(SourcedText, {"text": SourceDataWithPath.create("reference", "loop/item", nameField)})
			)
		);
		
		let spacing = this.getSourcedProp("itemSpacingMarkup");
		
		let defaultLoop = MarkupLoop.create(null, Wprr.sourceReference("itemMarkup"), spacing);
		
		return [React.createElement(WprrDataLoader, {"loadData": {"input": "wprr/v1/global/wpml/languages?page=" + encodeURIComponent(document.location.href)}},
			React.createElement(Wprr.ReferenceInjection, {"injectData": {
				"itemMarkup": itemMarkup
			}},
				React.createElement(Loop, {"loop": defaultLoop}, children)
			)
		)];
	}
}

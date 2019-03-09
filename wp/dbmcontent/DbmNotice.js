import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";
import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Loop from "wprr/elements/create/Loop";
import InjectChildren from "wprr/manipulation/InjectChildren";
import QueryStringParameters from "wprr/manipulation/QueryStringParameters";
import HasData from "wprr/manipulation/HasData";
import SourceData from "wprr/reference/SourceData";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import SourcedText from "wprr/elements/text/SourcedText";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import Adjust from "wprr/manipulation/Adjust";

//import DbmNotice from "wprr/wp/dbmcontent/DbmNotice";
export default class DbmNotice extends ManipulationBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_getChildrenToClone() {
		
		let children = super._getChildrenToClone();
		
		if(children.length === 0) {
			children = React.createElement(InjectChildren);
		}
		
		let itemMarkup = React.createElement(WprrBaseObject, {"className": SourceData.create("combine", ["notice", " ", SourceDataWithPath.create("reference", "loop/item", "type.slug")])},
			React.createElement(SourcedText, {"text": SourceDataWithPath.create("reference", "loop/item", "content"), "format": "html"})
		);
		
		let defaultLoop = MarkupLoop.create(null, itemMarkup);
		
		return [React.createElement(QueryStringParameters, {"parameters": "notice"},
			React.createElement(HasData, {"check": SourceData.create("prop", "notice")},
				React.createElement(Adjust, {"adjust": DbmNotice._adjust_prefixNoticies},
					React.createElement(WprrDataLoader, {"loadData": {"input": SourceData.create("combine", ["wprr/v1/range/dbm_area/relation,languageTerm/notice?type=notice&relation=", SourceData.create("prop", "notice")])}},
						React.createElement(Loop, {"loop": defaultLoop}, children)
					)
				)
			)
		)];
	}
	
	static _adjust_prefixNoticies(aProps, aElement) {
		
		let newArray = new Array();
		
		let currentArray = aProps["notice"].split(",");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			newArray.push("notices/" + currentArray[i]);
		}
		
		aProps["notice"] = newArray.join(",");
		
		return aProps;
	}
}

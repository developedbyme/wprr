import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Adjust from "wprr/manipulation/Adjust";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";
import WpTermFunctions from "wprr/wp/WpTermFunctions";

//import TermName from "wprr/elements/text/TermName";
export default class TermName extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let taxonomy = this.getSourcedPropWithDefault("taxonomy", "category");
		let field = this.getSourcedPropWithDefault("field", "id");
		let termId = this.getSourcedProp("termId");
		
		return React.createElement(WprrDataLoader, {"loadData": {"terms": "wprr/v1/taxonomy/" + taxonomy +"/terms"}},
			React.createElement(Adjust, {"adjust": TermName._adjust_selectTerm, "termId": termId, "field": field},
				React.createElement(SourcedText, {"text": SourceDataWithPath.create("prop", "term", "name")})
			)
		);
	}
	
	static _adjust_selectTerm(aReturnObject, aManipulationObject) {
		
		let termId = aManipulationObject.getSourcedPropInAdjust("termId", aReturnObject);
		let field = aManipulationObject.getSourcedPropInAdjust("field", aReturnObject);
		let terms = aManipulationObject.getSourcedPropInAdjust("terms", aReturnObject);
		
		delete aReturnObject["termId"];
		delete aReturnObject["terms"];
		delete aReturnObject["field"];
		
		let selectedTerm = WpTermFunctions.getTermBy(field, termId, terms);
		aReturnObject["term"] = selectedTerm;
		
		return aReturnObject;
	}
}
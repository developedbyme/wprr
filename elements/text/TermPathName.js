import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Adjust from "wprr/manipulation/Adjust";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";

//import TermPathName from "wprr/elements/text/TermPathName";
export default class TermPathName extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let taxonomy = this.getSourcedPropWithDefault("taxonomy", "category");
		let termId = this.getSourcedProp("termId");
		let separator = this.getSourcedPropWithDefault("separator", Wprr.text(" / "));
		let skipTopLevels = this.getSourcedPropWithDefault("skipTopLevels", 0);
		
		return React.createElement(WprrDataLoader, {loadData: {"terms": "wprr/v1/taxonomy/" + taxonomy +"/terms"}},
			React.createElement(Adjust, {adjust: TermPathName._adjust_selectTerms, termId: termId, skipTopLevels: skipTopLevels},
				React.createElement(Wprr.Loop, {"loop": Wprr.adjusts.markupLoop(
					Wprr.sourceProp("terms"),
					React.createElement(SourcedText, {text: Wprr.sourceReference("loop/item", "name")}),
					separator
				)})
			)
		);
	}
	
	static _adjust_selectTerms(aReturnObject, aManipulationObject) {
		
		let termId = parseInt(aReturnObject["termId"], 10);
		let returnArray = new Array();
		
		let debugCounter = 0;
		while(termId !== 0) {
			if(debugCounter++ > 100) {
				console.error("Loop ran for too long");
				break;
			}
			
			let currentTerm = Wprr.utils.wpTerms.getTermBy("id", termId, aReturnObject["terms"]);
			if(!currentTerm) {
				console.error("Term with id " + termId + " doesn't exist");
				break;
			}
			
			returnArray.unshift(currentTerm);
			termId = currentTerm.parentId;
		}
		
		let skipTopLevels = aReturnObject["skipTopLevels"]
		if(skipTopLevels) {
			returnArray.splice(0, skipTopLevels);
		}
		
		delete aReturnObject["termId"];
		delete aReturnObject["terms"];
		delete aReturnObject["skipTopLevels"];
		
		aReturnObject["terms"] = returnArray;
		
		return aReturnObject;
	}
}
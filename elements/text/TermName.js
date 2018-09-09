import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import WprrDataLoader from "wprr/manipulation/loader/WprrDataLoader";
import Adjust from "wprr/manipulation/Adjust";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";

//import TermName from "wprr/elements/text/TermName";
export default class TermName extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		let taxonomy = this.getSourcedPropWithDefault("taxonomy", "category");
		let termId = this.getSourcedProp("termId");
		
		return <WprrDataLoader loadData={{
			"terms": "wprr/v1/taxonomy/" + taxonomy +"/terms",
		}}>
			<Adjust adjust={TermName._adjust_selectTerm} termId={termId}>
				<SourcedText text={SourceDataWithPath.create("prop", "term", "name")} />
			</Adjust>
		</WprrDataLoader>;
	}
	
	static _adjust_selectTerm(aReturnObject, aManipulationObject) {
		
		let termId = aReturnObject["termId"];
		
		let currentArray = aReturnObject["terms"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentTerm = currentArray[i];
			if(currentTerm.id === termId) {
				aReturnObject["term"] = currentTerm;
				break;
			}
		}
		
		delete aReturnObject["termId"];
		delete aReturnObject["terms"];
		
		return aReturnObject;
	}
}
import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import Parts from "./parts-circular.js";

// import TermWithChildren from "wprr/elements/form/wp/TermWithChildren";
export default class TermWithChildren extends WprrBaseObject {
	
	constructor() {
		super();
	}
	
	_renderMainElement() {
		
		let indent = this.getReference("indent");
		let parents = this.getReference("parentTerms");
		let termWithChildren = this.getFirstInput("term");
		let term = termWithChildren.term;
		let children = termWithChildren.children;
		
		let newParents = [].concat(parents, termWithChildren.term);
		
		return React.createElement(React.Fragment, {},
			React.createElement(Wprr.AddProps, {"term": term},
				React.createElement(Parts.TermSelection)
			),
			React.createElement(Wprr.HasData, {"check": children, "checkType": "notEmpty"},
				React.createElement("div", {"className": "spacing small"}),
				React.createElement(Wprr.ReferenceInjection, {"injectData": {"indent": indent+1, "parentTerms": newParents, "termsTree": termWithChildren.children}},
					React.createElement(Parts.TermLoop, {})
				)
			)
		);
	}
}
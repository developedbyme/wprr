import Wprr from "wprr/Wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

import Parts from "./parts-circular.js";

// import TermLoop from "wprr/elements/form/wp/TermLoop";
export default class TermLoop extends WprrBaseObject {
	
	constructor() {
		super();
	}
	
	_renderMainElement() {
		
		let defaultItem = React.createElement(Parts.TermWithChildren, {"term": Wprr.sourceReference("loop/item")});
		let defaultSpacing = React.createElement(Parts.ItemSpacing);
		
		return Wprr.Loop.createMarkupLoop(Wprr.sourceReference("termsTree"), defaultItem, defaultSpacing);
	}
}